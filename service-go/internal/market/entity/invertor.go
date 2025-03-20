package entity

type Invertor struct {
	ID            string
	Name          string
	AssetPosition []*InvertorAssetPosition
}

func NewInvertor(id string) *Invertor {
	return &Invertor{
		ID:            id,
		AssetPosition: []*InvertorAssetPosition{},
	}
}

type InvertorAssetPosition struct {
	AssetID string
	Shares  int
}
