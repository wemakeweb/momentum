export default class TestModel extends Momentum.Model {
	static schema = {
		titel: Momentum.Type.string,
		content: Momentum.Type.string
	}

	static tableName = 'TestModel'
}