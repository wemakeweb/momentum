import MomentumStore from './MomentumStore';

export default class RethinkStore extends MomentumStore {
	/**
	 * specify the table here, if no table is
	 * specifed the model `name` is used
	 */
	
	static tableName = ''

	/**
	 * specify the database here, if no database is
	 * specifed the default database is used
	 */

	static database = ''
}