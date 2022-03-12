import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid'

import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task: Task) => task.status === status);
        }
        
        if (search) {
            tasks = tasks.filter((task: Task) => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true;
                }
                return false;
            })
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find((task: Task) => task.id === id); 

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);

        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        
        if (!found) {
            throw new NotFoundException();
        }

       this.tasks = this.tasks.filter((task: Task) => task.id !== found.id)
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
       const task = this.getTaskById(id);
       task.status = status;

       return task;
    }
}
