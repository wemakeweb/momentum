export default class ClockModel extends Momentum.Stores.RethinkStore {
	static schema = {
		hour: Momentum.Type.number,
		minutes: Momentum.Type.number,
		seconds: Momentum.Type.number
	}

	static tableName = 'ClockModel'
}