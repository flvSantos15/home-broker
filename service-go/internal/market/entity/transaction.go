package entity

import (
	"time"

	"github.com/google/uuid"
)

// Parei no 52:27

type Transaction struct {
	ID           string
	SellingOrder *Order
	BuyingOrder  *Order
	Shares       int
	Price        float64
	Total        float64
	DateTime     time.Time
}

func NewTransaction(sellingOrder *Order, burOrder *Order, shares int, price float64) *Transaction {
	return &Transaction{
		ID:           uuid.New().String(),
		SellingOrder: sellingOrder,
		BuyingOrder:  burOrder,
		Shares:       shares,
		Price:        price,
		Total:        price * float64(shares),
		DateTime:     time.Now(),
	}
}

func (t *Transaction) Process() {
	processor := NewOrderProcessor(t)
	processor.Process()
}
