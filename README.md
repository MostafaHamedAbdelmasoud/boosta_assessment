# boosta_assessment

## database
```
books {
	id integer pk increments unique
	title varchar
	author varchar
	ISBN varchar
	available_quantity integer
	shelf_location varchar
}

borrowers {
	id integer pk increments unique
	email varchar unique
	password varchar
	registered_date date
}

reservations {
	id integer pk increments unique
	book_id integer unique *> books.id
	borrower_id integer >* borrowers.id
}
```

<img width="348" alt="Screenshot 2024-08-16 at 1 15 53 AM" src="https://github.com/user-attachments/assets/ec33c622-96f7-4d96-9f72-67a21e9389ca">


## enhancements (I need more time):
1- Refactor the code

2- Write a proper documentation

3- write more feature tests

# usages:
1- redis: to reduce the response time

3- docker

# steps to run the project:

1- create .env file from .env.example

2- fill your container credentials

3- run docker scripts



Docker scripts:

``` docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build ```


turn off all containers



``` docker-compose -f docker-compose.yml -f docker-compose.dev.yml down ```
