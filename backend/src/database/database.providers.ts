import { createConnection } from 'typeorm';

export const databaseProviders = [
	{
		provide: 'DATABASE_CONNECTION',
		useFactory: async () => await createConnection({
			type: 'postgres',
			/*Docker */
			/*host: 'db',*/
			host: 'localhost',
			port: 5432,
			username: 'root',
			password: '1234567890',
			database: 'db',
			entities: [
				__dirname + '/../**/*.entity{.ts,.js}',
			],
			synchronize: true,
		}),
	},
];