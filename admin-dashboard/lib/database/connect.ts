import mongoose, { Mongoose } from "mongoose"
const dns = require('node:dns');

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
    conn: Mongoose | null,
    promise: Promise<Mongoose> | null
}

let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn
    if (!MONGODB_URL) throw new Error("Missing MongoDB URL!")


    dns.setServers(['1.1.1.1', '1.0.0.1']);

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, { bufferCommands: false })
    cached.conn = await cached.promise
    return cached.conn
}