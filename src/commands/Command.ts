// This is the Command interface used for the Factory pattern

export interface ICommand { 
    run(data:any): Promise<unknown>; 
}