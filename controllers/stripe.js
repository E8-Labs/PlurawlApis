import StripeSdk from 'stripe'
import axios from 'axios';
import qs from 'qs'

export const createCustomer = async (user) => {

    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    console.log("Key is ", key)
    const stripe = StripeSdk(key);


    try {

        let alreadyCustomer = await findCustomer(user)
        // console.log("Already found ", alreadyCustomer)
        if (alreadyCustomer.data.length === 1) {
            return alreadyCustomer.data[0]
        }
        else {
            const customer = await stripe.customers.create({
                name: user.name,
                email: user.email,
                metadata: { id: user.id }
            });
            return customer
        }


        // return customer
    }
    catch (error) {
        console.log(error)
        return null
    }
}

export const findCustomer = async (user) => {

    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    console.log("Key is ", key)
    const stripe = StripeSdk(key);
    try {
        // const customer = await stripe.customers.search({
        //     query: `email: '${user.email}'`
        // }); 

        const customer = await stripe.customers.search({
            query: `metadata['id']:'${user.id}'`
        });

        return customer
    }
    catch (error) {
        console.log(error)
        return null
    }
}


export const createCard = async (user, token) => {

    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    console.log("Key is ", key)
    const stripe = StripeSdk(key);

    try {
        let customer = await createCustomer(user);

        const customerSource = await stripe.customers.createSource(
            customer.id,
            {
                source: token,
            }
        );

        return customerSource
    }
    catch (error) {
        console.log(error)
        return null
    }
}

// export const deleteCard = async (user, token) => {

//     let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
//     console.log("Key is ", key)
//     const stripe = StripeSdk(key);

//     try {
//         let customer = await createCustomer(user);

//         const customerSource = await stripe.customers.deleteSource(
//             customer.id,
//             {
//                 source: token,
//             }
//         );

//         return customerSource
//     }
//     catch (error) {
//         console.log(error)
//         return null
//     }
// }

export const loadCards = async (user) => {
    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    console.log("Key is ", key)
    const stripe = StripeSdk(key);

    try {
        let customer = await createCustomer(user);
        
        
        let data = qs.stringify({
            'limit': '10'
        });

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.stripe.com/v1/customers/${customer.id}/cards?limit=3`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${key}`
            },
            data: data
        };

        let response = await axios.request(config);
            if (response) {
                console.log("Load cards request");
                console.log(JSON.stringify(response.data.data));
                return response.data.data;
            }
            else{
                console.log("Load cards request errored");
                console.log(error);
                return null
            };
    }
    catch (error) {
        console.log("Load cards request errored out");
        console.log(error)
        return null
    }


}