# Feature TODO List

Use this file to track features we plan, build, and ship together.

## Backlog

- [ ] Add login/register page

```bash
curl https://time-tracking-api.zhunio.org/auth/login \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "admin@example.com",
  "password": "secret"
}'

curl https://time-tracking-api.zhunio.org/auth/register \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "email": "new.user@example.com",
  "password": "secret",
  "firstName": "New",
  "lastName": "User",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "isAdmin": false
}'
```

- [ ] Add admin page for user management

```bash
curl https://time-tracking-api.zhunio.org/users \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "email": "john@example.com",
  "password": "secret",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "isAdmin": false
}'

curl https://time-tracking-api.zhunio.org/users \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'

curl 'https://time-tracking-api.zhunio.org/users/{id}' \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "email": "john@example.com",
  "password": "secret",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "isAdmin": false
}'

curl 'https://time-tracking-api.zhunio.org/users/{id}' \
  --request DELETE \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

- [ ] Add CRUD page for time tracking

```bash
curl https://time-tracking-api.zhunio.org/time-trackers \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "userId": "clz8v2v9u0000abcd1234efgh",
  "date": "2026-02-16T00:00:00.000Z",
  "startTime": "09:00",
  "endTime": "17:00"
}'

curl https://time-tracking-api.zhunio.org/time-trackers \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'

curl 'https://time-tracking-api.zhunio.org/time-trackers/{id}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'

curl 'https://time-tracking-api.zhunio.org/time-trackers/{id}' \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "userId": "clz8v2v9u0000abcd1234efgh",
  "date": "2026-02-16T00:00:00.000Z",
  "startTime": "09:00",
  "endTime": "17:00"
}'

curl 'https://time-tracking-api.zhunio.org/time-trackers/{id}' \
  --request DELETE \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

## In Progress

- [ ] _None yet_

## Done

- [ ] _None yet_
