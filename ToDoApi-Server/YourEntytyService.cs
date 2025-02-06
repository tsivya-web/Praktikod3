
using Microsoft.EntityFrameworkCore;
using ToDoApi;

public class YourEntytyService{
    private readonly ToDoDbContext  _context;

public YourEntytyService(ToDoDbContext context){
_context=context;
}
public async Task <List<Item>> GetAllEntitiesAsync(){
    return await _context.Items.ToListAsync();
}

}