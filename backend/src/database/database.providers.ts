import { createConnection } from 'typeorm';

export const databaseProviders = [
	{
		provide: 'DATABASE_CONNECTION',
		useFactory: async () => await createConnection({
			type: 'postgres',
			/*Docker */
			/*host: 'db',*/
			host: process.env.DB_URL,
			port: parseInt(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [
				__dirname + '/../**/*.entity{.ts,.js}',
			],
			synchronize: true,
			extra: {
				ssl: true
	 		}
		}),
	},
];