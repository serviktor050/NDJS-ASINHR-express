# NDJS-ASINHR-express
## Домашняя работа к 2.1. Express

## Домашняя работа к 2.5. Docker: контейнеризация приложения

Команда для запуска: docker-compose -f docker-compose.dev.yml up

## Домашняя работа к 2.6. База данных и хранение данных

Задание 2

db.books.insertMany([
    {
        id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Война и мир",
        description: "Роман-эпопея Льва Толстого",
        authors: "Лев Толстой",
    },
    {
        id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        title: "Преступление и наказание",
        description: "Социально-психологический роман Фёдора Достоевского",
        authors: "Фёдор Достоевский",
    }
])

db.books.find({ title: "Война и мир" })

db.books.updateOne(
    { _id: ObjectId("65a1b2c3d4e5f6a7b8c9d0e1") },
    {
        $set: {
            description: "Роман-эпопея Льва Толстого (обновлено)",
            authors: "Лев Толстой (обновлено)"
        }
    }
)