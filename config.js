var dbAccess={
    "DB_NAME":process.env.DB_NAME,
    "MONGODB_URI":process.env.MONGODB_URI,
    "DB_COLLECTION_FOLLOWING":process.env.DB_COLLECTION_FOLLOWING,
    "DB_COLLECTION_FOLLOWER":process.env.DB_COLLECTION_FOLLOWER,
    "DB_COLLECTION_USER":process.env.DB_COLLECTION_USER,
    "DB_COLLECTION_POST":process.env.DB_COLLECTION_POST
}


module.exports=dbAccess;
