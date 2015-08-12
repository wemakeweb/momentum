export default class TestModel extends Momentum.Stores.RethinkStore {
	static schema = {
		titel: Momentum.Type.string,
		content: Momentum.Type.string
	}

	static tableName = 'TestModel'
}