import StripeSdk from 'stripe'
import axios from 'axios';
import qs from 'qs'
import db from "../models/index.js";


export const SubscriptionTypesSandbox = [
    { type: "Monthly", price: 19.99, id: "price_1PBeaHB5evLOKOQy7eCxKp1l", environment: "Sandbox" },
    { type: "HalfYearly", price: 100, id: "price_1PBebWB5evLOKOQyCNx2ISuW", environment: "Sandbox" },
    { type: "Yearly", price: 49.99, id: "price_1PBebjB5evLOKOQynjl9AAOO", environment: "Sandbox" },
]

//update the subscription ids here to live ones
export const SubscriptionTypesProduction = [
    { type: "Monthly", price: 19.99, id: "price_1P9VnxB5evLOKOQyP1MYmcuc", environment: "Production" },
    { type: "HalfYearly", price: 100, id: "price_1P9Vp7B5evLOKOQyPWnc2OA6", environment: "Production" },
    { type: "Yearly", price: 49.99, id: "price_1P9VrLB5evLOKOQykDvowoG5", environment: "Production" },
]


export const createCustomer = async (user) => {

    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    console.log("Key is ", key)
    const stripe = StripeSdk(key);


    try {

        let alreadyCustomer = await findCustomer(user)
        console.log("Customer is ", alreadyCustomer)

        if (alreadyCustomer.data.length >= 1) {
            console.log("Already found ", alreadyCustomer)
            return alreadyCustomer.data[0]
        }
        else {
            const customer = await stripe.customers.create({
                name: user.name,
                email: user.email,
                metadata: { id: user.id }
            });
            console.log("Customer New ", customer)
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





export const createPromo = async (code, repetition = "once", duration_in_months = null, percent_off = 50, applies_to = "All") => {
    const key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    const stripe = StripeSdk(key);
    //Monthly, HalfYearly, Yearly
    let MonthPID = process.env.Environment === "Sandbox" ? "prod_Q1i0Ts5frQe8fZ" : "prod_PzUntWaL2cGCre"
    let HalfYearPID = process.env.Environment === "Sandbox" ? "prod_Q1i1XCOwozX1Vd" : "prod_PzUoUdee8wPQHA"
    let YearPID = process.env.Environment === "Sandbox" ? "prod_Q1i1ab5JC4J7Ql" : "prod_PzUrqNVq181qHi"
    let products = [MonthPID, HalfYearPID, YearPID,]
    console.log("Using products for ", process.env.Environment)
    if (applies_to === "Monthly") {
        products = [MonthPID]
    }
    else if (applies_to === "HalfYearly") {
        products = [HalfYearPID]
    }
    else if (applies_to === "Yearly") {
        products = [YearPID]
    }


    try {
        let data = {
            id: code,
            duration: "once",
            percent_off: percent_off,
            applies_to: {
                products: products
            }
        };

        if (duration_in_months !== null) {
            data.duration = "repeating";
            data.duration_in_months = duration_in_months;
        }

        const coupon = await stripe.coupons.create(data);
        return coupon;
    } catch (error) {
        console.error("Error creating promo:", error);
        throw error;
    }
};

export const GetCoupon = async (code) => {
    const key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    const stripe = StripeSdk(key);
    try {
        const coupon = await stripe.coupons.retrieve(code);
        return coupon;
    } catch (error) {
        console.error("Error retrieving coupon:", error);
        throw error;
    }
};



export const createSubscription = async (user, subscription, code = null) => {
    const key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    const stripe = StripeSdk(key);
    try {
        let customer = await createCustomer(user);
        let data = {
            customer: customer.id,
            items: [
                {
                    price: subscription.id,
                },
            ],
        };

        if (code !== null) {
            console.log("Code is not null");
            try {
                let coupon = await GetCoupon(code);
                if (coupon) {
                    console.log("Coupon exists:", coupon);
                    data.discounts = [{ coupon: code }];
                } else {
                    return { status: false, message: "No such coupon" };
                }
            } catch (error) {
                console.error("Error applying coupon:", error);
                return { status: false, message: "No such coupon" };
            }
        }

        console.log("Data applying for subscription is", data);
        const sub = await stripe.subscriptions.create(data);
        console.log("Subscribed successfully:", sub);
        return { data: sub, status: true, message: "User subscribed" };
    } catch (error) {
        console.error("Error creating subscription:", error);
        return { data: error, status: false, message: error.message };
    }
};


export const cancelSubscription = async (user, subscription) => {

    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    console.log("Subscription in stripe.js ", subscription)

    try {
        const stripe = StripeSdk(key);
        let customer = await createCustomer(user);
        let subid = subscription.subid;

        const sub = await stripe.subscriptions.cancel(
            subid,
            {
                cancel_at_period_end: true
            }
        );
        // let subs = await GetActiveSubscriptions(user)


        return { data: sub, status: true, message: "Subscription cancelled" };
    }
    catch (error) {
        console.log(error)
        return { data: error, status: false, message: error };
    }
}


// export const resumeSubscription = async (user, subscription) => {

//     let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
//     console.log("Subscription in stripe.js ", subscription)

//     try {
//         const stripe = StripeSdk(key);
//         let customer = await createCustomer(user);
//         let subid = subscription.subid;

//         const sub = await stripe.subscriptions.resume(
//             subid
//           );
//         // let subs = await GetActiveSubscriptions(user)


//         return { data: sub, status: true, message: "Subscription cancelled" };
//     }
//     catch (error) {
//         console.log(error)
//         return { data: error, status: false, message: error };
//     }
// }



export const CreateWebHook = async (req, res) => {
    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    const stripe = StripeSdk(key);

    const webhookEndpoint = await stripe.webhookEndpoints.create({
        enabled_events: ['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'customer.subscription.paused', 'customer.subscription.resumed',
    'customer.subscription.pending_update_applied', 'customer.subscription.pending_update_expired'],
        url: req.body.url,
    });
    res.send({status: true, message: "Webhook", webhookEndpoint})
}


export const SubscriptionUpdated = async (req, res)=>{
    let data = req.body;
    console.log("Subscription updated", data)
    let type = data.type;
    console.log("EVent is ", type);

    if(type === "customer.subscription.updated" || type === 'customer.subscription.pending_update_expired'
    || type === 'customer.subscription.paused' || type === 'customer.subscription.resumed' || type === 'customer.subscription.pending_update_applied'){
        let sub = data.data.object;
        let subid = sub.id;
        let dbSub = await db.subscriptionModel.findOne({
            where:{
                subid: subid
            }
        })
        console.log("Sub from db ", dbSub)
        if(dbSub){
            dbSub.data = JSON.stringify(sub)
            dbSub.save(); 
        }
    }
    if(type === "customer.subscription.deleted"){
        let sub = data.data.object;
        let subid = sub.id;
        let dbSub = await db.subscriptionModel.destroy({
            where:{
                subid: subid
            }
        })
        console.log("Subscription deleted")
    }
    res.send({status: true, message: "Subscription updated", event: type})
}
export const RetrieveASubscriptions = async (subid) => {
    console.log("Retrieving ", subid)
    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    // console.log("Subscription in stripe.js ", subscription)

    try {
        const stripe = StripeSdk(key);
        const sub = await stripe.subscriptions.retrieve(
            subid
        );
        return sub
    }
    catch (error) {
        console.log(error)
        return null
    }
}


export const GetActiveSubscriptions = async (user) => {

    let key = process.env.Environment === "Sandbox" ? process.env.STRIPE_SK_TEST : process.env.STRIPE_SK_PRODUCTION;
    // console.log("Subscription in stripe.js ", subscription)

    try {
        const stripe = StripeSdk(key);
        let customer = await createCustomer(user);
        const sub = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active'
        });
        // console.log("##############")
        // console.log("Subscriptions for user  ", user.name)
        // console.log("##############")
        return sub
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
        else {
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