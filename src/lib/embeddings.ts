import { OpenAIApi, Configuration } from 'openai-edge'



const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!
})


const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string) {
    // Need to buy the model from OpenAI. For ambeddings to work.
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replaceAll(/\n/g, " ")
        })

        const result = await response.json()
        console.log("result, ", result)
        return result.data[0].embedding as number[];


    } catch (error) {
        console.log("Error calling openAI embedding api, ", error)
        throw Error
    }
} 