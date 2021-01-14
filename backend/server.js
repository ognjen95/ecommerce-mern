const express = require('express')
const app = express()
const connectDB = require('./config/db') 
const dotenv = require('dotenv')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const path = require('path') 


dotenv.config()

connectDB()

app.use(express.json())

app.get('/', (req,res)=>{
    res.send('API RUNING....')
})
 
app.use('/api/products', productRoutes) 
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req,res) => res.send(process.env.PAYPAL_CLIENT_ID))

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen (PORT, console.log(`Server runing in ${process.env.NODE_ENV} mode , on port ${PORT} `))
