export class Slug {
  private constructor(private readonly value: string) {}

  public static create(name: string): Slug {
    const slugified = name
            .normalize('NFD')                
            .replace(/[\u0300-\u036f]/g, '') 
            .toLowerCase()                   
            .trim()                          
            .replace(/[^a-z0-9\s-]/g, '')    
            .replace(/\s+/g, '-')            
            .replace(/-+/g, '-'); 

    if (slugified.length < 3) throw new Error("Slug inválido.");
    return new Slug(slugified);
  }

  get getValue(): string { return this.value; }
}
