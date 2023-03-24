# Sweeft

```git clone https://github.com/Fugazzii/Sweeft```
<br/>
```npm run dev```

```http
POST /api/user/register
Content-Type: application/json

{
    "email": "sichinavailia@gmail.com",
    "password": "123456789"
}
```

<br/>

```http
POST /api/user/login
Content-Type: application/json

{
    "email": "email@example.com",
    "password": "123456789"
}
```

<br/>

```http
POST /api/user/reset/
Content-Type: application/json

{
    "email": "email@example.com"
}
```

<br />

```http
POST /api/user/reset/:token
Content-Type: application/json

{
    "new_password": "my_new_password"
}
```

<br />

```http
POST /api/category/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "name": "Transport"
}
```

<br/>

```http
PUT /api/category/add_transaction
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "names": "Transport",
    "quantity": "-400",
    "description": "private"
}
```

<br/>

```http
DELETE /api/category/delete
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "name": "Transport"
}
```

<br />

```http
PUT /api/category/rename
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "name": "Transport",
    "new_name": "Gaming"
}
```

<br />

```http
GET /api/category/search_by_expense/:email/:order
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

<br />

### You can also
- Filter by incomes
- Filter by status
- Filter by date