async function main(){
    const newUser = await prisma.users.create({
       data: {
        username: "Lewis",
        password: "123"
       }
    })

    console.log(`new user created: ${newUser}`);
}

main();