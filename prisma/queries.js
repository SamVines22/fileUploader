const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
//const { connect } = require('../../../membersOnly/membersOnly/db/pool');

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })


class newClass {
    async createUser(username, password) {
        console.log("here we are");
        console.log(username);
        console.log(password);
          await  prisma.users.create({
                data: {
                    username:username,
                    password: password
                }
            })        
    }

    async getUser(id) {
       
        const user = await prisma.users.findUnique({where: {id:id}});
        console.log(user);
        return user;
    }

    async addFile(name, url,file,size) {
        console.log("add new file");
         await prisma.file.create({
             data: { name:name, url:url, type: file, size:size}
        })
    }

    async getAllFiles() {
        const files = await prisma.file.findMany({relationLoadStrategy: 'join'});
        console.log(files);
        return files;
    }

    async getFolders() {
        const folders = await prisma.folders.findMany({});
        return folders;
    }

    async addFolder (name) {
        await prisma.folders.create({
            data: {
                name: name
            }
        })
    }

    async addToFolder(itemId, folderId) {
        
        await prisma.file_on_folder.create({
            data: {fileId: itemId, folderId:folderId }
        })
    }

    async removeFromFolder(itemId, folderId) {
        const record = await prisma.file_on_folder.findFirst({
            where: {
               AND:[
                {fileId:itemId}, {folderId:folderId}
               ],
            },
        })
        const recordId = record.id;
        await prisma.file_on_folder.delete({
            where: {
                id:recordId
            }
        })
    }

    async getOneFolder(id) {
        const folder = await prisma.file_on_folder.findMany({
            include: {file:true, folder:true},
            where: {folderId:id}
        })
        if (folder.length == 0) {
            const gimp = await prisma.folders.findUnique({where: {id:id}});
            return gimp;
        }
       // console.log(folder);
       else { return folder; }
    }

    async getOtherFiles(data) {
        console.log(data);
        let fileIds = []
        for (let x=0; x<data.length;x++)
        {
            fileIds.push(data[x].id)
        }
        console.log(fileIds);
        const otherFiles = await prisma.file.findMany({
            where: {id :{ not: { in: fileIds}}}
        })
        console.log(otherFiles);
        return otherFiles;
    }

    async getFileDetails(id) {
        const data = await prisma.file_on_folder.findMany({
           include: {file:true, folder:true},
           where: {fileId:id}
        })
        return data;

    }

    async getFile(id) {
        const data = await prisma.file.findUnique({where: {id:id}});
        return data;
    }

}


module.exports = newClass;