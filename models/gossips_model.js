import mongoose from "mongoose";
import { type } from "os";
import { stringify } from "querystring";

const gossipsSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    gossip:{
        type:String,
        required:true,
    },
    upvote:{
        type:Number
    },
    downvote:{
        type:Number
    },
    time:{
        type:String,
        required:true
    }
})

const Gossips= mongoose.model('Gossips', gossipsSchema,'gossips');
export default Gossips;