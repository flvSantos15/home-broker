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

// Parei no 1:32:06

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
		}
	}
}
