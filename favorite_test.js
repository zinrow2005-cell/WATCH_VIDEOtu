
var state={videos:[],profiles:{daughter:{favorites:[]}},activeProfile:'daughter'};
function profile(){return state.profiles[state.activeProfile]}
function videoById(id){return state.videos.find(function(v){return v.id===id})}
function ensureFavoriteId(id){var p=profile();if(p.favorites.indexOf(id)<0)p.favorites.unshift(id)}
function saveVideoAsFavorite(video,category){
 var existing=videoById(video.id);
 if(!existing){existing={id:video.id,title:video.title,category:category};state.videos.push(existing)}
 if(category)existing.category=category;
 ensureFavoriteId(existing.id);
 return existing;
}
saveVideoAsFavorite({id:'abcdefghijk',title:'A'},'英文');
saveVideoAsFavorite({id:'abcdefghijk',title:'A'},'兒歌');
if(state.videos.length!==1||profile().favorites.length!==1||profile().favorites[0]!=='abcdefghijk'||state.videos[0].category!=='兒歌')process.exit(2);
console.log('favorite pipeline passed');
