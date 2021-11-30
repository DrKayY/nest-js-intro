import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task-dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) taskFilters: GetTasksFilterDto,
    @Req() req,
  ): Promise<Task[]> {
    const user: User = req.user;
    return this.tasksService.getAllTasks(taskFilters, user);
  }

  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Task> {
    const user: User = req.user;
    return this.tasksService.getTaskById(id, user);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user: User = req.user;
    await this.tasksService.deleteTask(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    const user: User = req.user;
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
  ): Promise<Task> {
    const user: User = req.user;
    return this.tasksService.updateTask(id, status, user);
  }
}
