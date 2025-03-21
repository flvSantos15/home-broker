package entity

import "sync"

type Book struct {
	Orders          []*Order
	Transactions    []*Transaction
	IncomingOrders  chan *Order
	ProcessedOrders chan *Order
	Wg              *sync.WaitGroup
}

func NewBook(incommingOrders chan *Order, processedOrders chan *Order, wg *sync.WaitGroup) *Book {
	return &Book{
		Orders:          []*Order{},
		Transactions:    []*Transaction{},
		IncomingOrders:  incommingOrders,
		ProcessedOrders: processedOrders,
		Wg:              wg,
	}
}

type orderQueue []*Order

func (oq *orderQueue) Add(order *Order) {
	*oq = append(*oq, order)
}

func (oq *orderQueue) GetNextOrder() *Order {
	if len(*oq) == 0 {
		return nil
	}
	order := (*oq)[0]
	*oq = (*oq)[1:]
	return order
}

func (b *Book) Trade() {
	buyOrders := make(map[string]*orderQueue)
	sellOrders := make(map[string]*orderQueue)

	for order := range b.IncomingOrders {
		asset := order.Asset.ID

		if buyOrders[asset] == nil {
			buyOrders[asset] = &orderQueue{}
		}

		if sellOrders[asset] == nil {
			sellOrders[asset] = &orderQueue{}
		}

		if order.OrderType == "BUY" {
			b.tryMatch(order, sellOrders[asset], buyOrders[asset])
		} else {
			b.tryMatch(order, buyOrders[asset], sellOrders[asset])
		}
	}
}

func (b *Book) tryMatch(newOrder *Order, availableOrders, pedingOrders *orderQueue) {
	for {
		pontentialMatch := availableOrders.GetNextOrder()
		if pontentialMatch == nil {
			break
		}

		if !b.pricesMatch(newOrder, pontentialMatch) {
			availableOrders.Add(pontentialMatch)
			break
		}

		if pontentialMatch.PendingShares > 0 {
			matchedTransaction := b.createTransaction(newOrder, pontentialMatch)
			b.processTransaction(matchedTransaction)

			if pontentialMatch.PendingShares > 0 {
				availableOrders.Add(pontentialMatch)
			}

			if newOrder.PendingShares == 0 {
				break
			}
		}
	}

	if newOrder.PendingShares > 0 {
		pedingOrders.Add(newOrder)
	}
}

func (b *Book) pricesMatch(order, matchOrder *Order) bool {
	if order.OrderType == "BUY" {
		return matchOrder.Price <= order.Price
	}

	return matchOrder.Price >= order.Price
}

func (b *Book) createTransaction(incomingOrder *Order, matchedOrder *Order) *Transaction {
	var buyOrder, sellOrder *Order

	if incomingOrder.OrderType == "BUY" {
		buyOrder, sellOrder = incomingOrder, matchedOrder
	} else {
		buyOrder, sellOrder = matchedOrder, incomingOrder
	}

	shares := incomingOrder.PendingShares
	if incomingOrder.PendingShares > matchedOrder.PendingShares {
		shares = matchedOrder.PendingShares
	}

	return NewTransaction(sellOrder, buyOrder, shares, matchedOrder.Price)
}

func (b *Book) recordTransaction(transaction *Transaction) {
	b.Transactions = append(b.Transactions, transaction)
	transaction.BuyingOrder.Transactions = append(transaction.BuyingOrder.Transactions, transaction)
	transaction.SellingOrder.Transactions = append(transaction.SellingOrder.Transactions, transaction)
}

func (b *Book) processTransaction(transaction *Transaction) {
	defer b.Wg.Done()
	transaction.Process()
	b.recordTransaction(transaction)
	b.ProcessedOrders <- transaction.BuyingOrder
	b.ProcessedOrders <- transaction.SellingOrder
}
