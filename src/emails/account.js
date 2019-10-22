const sgmail=require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendwelcomemail= (email , name )=>
{
    sgmail.send({
        to:email,
        from:'cool.dipesh017@gmail.com',
        subject:'welcome to task manager',
        text:`hi ${name} . hope u like the application`
    
    })
}

const sendremoveemail=(email , name)=>
{
    sgmail.send({
        to:email,
        from:'cool.dipesh017@gmail.com',
        subject:'account removed',
        text:`We dont want to let you go ${name}. please tell us how we can improve`
    })

}


module.exports={
    sendwelcomemail,
    sendremoveemail
}