import { User } from 'src/auth/user.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task-dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;
    return task;
  }

  async deleteTask(id: number, user: User): Promise<DeleteResult> {
    return await this.delete({ id, userId: user.id });
  }

  async getTasks(taskFilters: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = taskFilters;

    const query = this.createQueryBuilder('task');

    query.andWhere('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = query.getMany();
    return await tasks;
  }
}
