import { createHash } from 'crypto';
export default (content)=>{
    return createHash('md5').update(content).digest("hex")
}