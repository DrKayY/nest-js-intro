import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task-dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepo: TaskRepository,
  ) {}

  async getAllTasks(
    taskFilters: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepo.getTasks(taskFilters, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    try {
      const found = await this.taskRepo.findOne({
        where: { id, userId: user.id },
      });
      if (!found) throw new NotFoundException(`Task with id "${id}" not found`);
      return found;
    } catch (error) {
      this.logger.error(
        `Failed to get task with id: ${id} for user: ${
          user.username
        }, user payload: ${JSON.stringify(user)}`,
        error.stack,
      );

      throw new InternalServerErrorException(
        'Error occurred while retrieving task',
      );
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepo.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepo.deleteTask(id, user);

    if (result.affected < 1)
      throw new NotFoundException(`Task with id "${id}" not found`);
  }

  async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();
    return task;
  }
}
