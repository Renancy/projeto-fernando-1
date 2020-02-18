import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    cooperativa: String,
    senha: String,
    taokeys: String,
    sockid: String,
        147:Array,
        148:Array,
        149:Array,
        157:Array,
        158:Array,
        159:Array,
        257:Array,
        258:Array,
        259:Array,
        267:Array,
        268:Array,
        269:Array,
        347:Array,
        348:Array,
        349:Array,
        357:Array,
        358:Array,
        359:Array,
        367:Array,
        368:Array,
        369:Array
})

const Aluno = mongoose.model('aluno', UserSchema)

export default Aluno