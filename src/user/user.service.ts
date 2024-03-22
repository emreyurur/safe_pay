import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/db-service/db-service.service';
@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}
 async create(createUserDto: Prisma.UserCreateInput) {
    const user = this.dbService.user.findUnique({where:{number:createUserDto.number}});
    if(user)
    {
    // await this.dbService.user.delete({where:{number:createUserDto.number}})
      await this.dbService.user.update({where : {number : createUserDto.number},data : createUserDto})
  }
  else{
    return this.dbService.user.create({data:createUserDto});
  }
  }

  findAll() {
    return this.dbService.user.findMany({select:{id:true,name:true}});
  }

  findOne(number: string) {
    return this.dbService.user.findUnique({where:{number:number},select:{wallet:true}});
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.dbService.user.update({where:{id:id},data:updateUserDto});
  }

  remove(id: number) {
    
    return this.dbService.user.delete({where:{id:id}});
  }
}
