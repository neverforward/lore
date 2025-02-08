import * as mc from '@minecraft/server'

const cmdHelp = {
  "use": [
    " - \u00a7l#lore add <target:player> <slot:number> <lores:string>\u00a7r",
    " - \u00a7l#lore set <target:player> <slot:number> <line:number> <lore:string>\u00a7r",
    " - \u00a7l#lore name <target:player> <slot:number> <name:string>\u00a7r",
    " - \u00a7l#lore clean <target:player> <slot:number>\u00a7r",
    " - \u00a7l#lore additem <target:player> <item:item> <count:number> <lores:string>\u00a7r",
  ],
  "arg": [
    " - target:player    玩家\u00a7r",
    " - slot:number      槽位\u00a7r",
    " - lores:string     描述(多个描述使用 , 分隔)\u00a7r",
    " - lore:string      描述\u00a7r",
    " - line:number      设置的描述在第几行\u00a7r",
    " - item:item        物品ID\u00a7r",
    " - count:number     物品数量(1~255)\u00a7r",
  ]
}
let help: string = "";

function getplayer(name: string) {
  let players = mc.world.getAllPlayers()
  for (let i = 0; i < players.length; i++) {
    if (players[i].name == name) return players[i];
  }
  return null;
}

function add(arg: string[], player: mc.Player) {
  if (arg.length < 5) return player.sendMessage("\u00a7l\u00a7c语法错误: 缺少参数\u00a7r\n" + help)

  let p = getplayer(arg[2]);
  if (!p) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效玩家 ${arg[2]} \u00a7r\n` + help);

  let slot = Number(arg[3]);
  if (isNaN(slot)) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效槽位 ${arg[3]} \u00a7r\n` + help);
  let item = p.getComponent("inventory").container.getSlot(slot);
  if (!item.hasItem()) return player.sendMessage(`\u00a7l\u00a7c运行错误: 槽位 ${arg[3]} 没有物品 \u00a7r\n`);

  let lores = arg[4].trim().replace('{s}',' ').split(',');
  item.setLore(lores);
  player.sendMessage(`\u00a77[${player.name}: 成功! 已将玩家 ${p.name} 槽位 ${slot} 的物品添加描述 ${lores} ]`)
}


function set(arg: string[], player: mc.Player) {
  if (arg.length < 6) return player.sendMessage("\u00a7l\u00a7c语法错误: 缺少参数\u00a7r\n" + help)

  let p = getplayer(arg[2]);
  if (!p) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效玩家 ${arg[2]} \u00a7r\n` + help);

  let slot = Number(arg[3]);
  if (isNaN(slot)) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效槽位 ${arg[3]} \u00a7r\n` + help);
  let item = p.getComponent("inventory").container.getSlot(slot);
  if (!item.hasItem()) return player.sendMessage(`\u00a7l\u00a7c运行错误: 槽位 ${arg[3]} 没有物品 \u00a7r\n`);

  let line = Number(arg[4]);
  if (isNaN(line) || line>=20) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效行数 ${arg[4]} \u00a7r\n` + help);

  let lore = arg[5].replace('{s}',' ');
  let lores = item.getLore();
  if (lores.length < line) for (let i = lores.length-1; i < line; i++) lores.push("");
  lores[line] = lore;
  item.setLore(lores);
  player.sendMessage(`\u00a77[${player.name}: 成功! 已将玩家 ${p.name} 槽位 ${slot} 的物品在行数 ${line} 设置描述 ${lore} ]`)
}
function name(arg: string[], player: mc.Player) {
  if (arg.length < 5) return player.sendMessage("\u00a7l\u00a7c语法错误: 缺少参数\u00a7r\n" + help)

  let p = getplayer(arg[2]);
  if (!p) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效玩家 ${arg[2]} \u00a7r\n` + help);

  let slot = Number(arg[3]);
  if (isNaN(slot)) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效槽位 ${arg[3]} \u00a7r\n` + help);
  let item = p.getComponent("inventory").container.getSlot(slot);
  if (!item.hasItem()) return player.sendMessage(`\u00a7l\u00a7c运行错误: 槽位 ${arg[3]} 没有物品 \u00a7r\n`);

  let name = arg[4];
  item.nameTag = name;
  
  player.sendMessage(`\u00a77[${player.name}: 成功! 已将玩家 ${p.name} 槽位 ${slot} 的物品命名为 ${name} ]`)
}
function clean(arg: string[], player: mc.Player) {
  if (arg.length < 4) return player.sendMessage("\u00a7l\u00a7c语法错误: 缺少参数\u00a7r\n" + help)

  let p = getplayer(arg[2]);
  if (!p) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效玩家 ${arg[2]} \u00a7r\n` + help);

  let slot = Number(arg[3]);
  if (isNaN(slot)) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效槽位 ${arg[3]} \u00a7r\n` + help);
  let item = p.getComponent("inventory").container.getSlot(slot);
  if (!item.hasItem()) return player.sendMessage(`\u00a7l\u00a7c运行错误: 槽位 ${arg[3]} 没有物品 \u00a7r\n`);

  item.setLore([]);
  
  player.sendMessage(`\u00a77[${player.name}: 成功! 已将玩家 ${p.name} 槽位 ${slot} 的物品清除描述 ]`)
}
function additem(arg: string[], player: mc.Player) {
  if (arg.length < 6) return player.sendMessage("\u00a7l\u00a7c语法错误: 缺少参数\u00a7r\n" + help);

  let p = getplayer(arg[2]);
  if (!p) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效玩家 ${arg[2]} \u00a7r\n` + help);

  let id = arg[3];

  let count = Number(arg[4]);
  if(isNaN(count)||count<=0||count>=255) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效数量 ${arg[4]} \u00a7r\n` + help)

  let lores = arg[5].trim().replace('{s}',' ').split(',');

  let inventory = p.getComponent("inventory").container;

  try {
    let item = new mc.ItemStack(id,count);
    item.setLore(lores);
    inventory.addItem(item);
  } catch(e) {
    return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效物品ID ${arg[3]} \u00a7r\n` + help);
  }

  player.sendMessage(`\u00a77[${player.name}: 成功! 已为玩家 ${p.name} 添加物品 ${id} 且带有描述 ${lores} ]`)
}

mc.world.afterEvents.chatSend.subscribe((e) => {
  const cmd = e.message.trim().split(" ");
  help = ''
  help += "\u00a7l\u00a72用法: \u00a7r\n"
  for (let i = 0; i < cmdHelp.use.length; i++) {
    help += cmdHelp.use[i] + '\n';
  }
  help += "\n\u00a7l\u00a72参数: \u00a7r\n"
  for (let i = 0; i < cmdHelp.arg.length; i++) {
    help += cmdHelp.arg[i] + '\n';
  }
  if (cmd[0] == '#lore') {
    if(!e.sender.isOp()) return e.sender.sendMessage(`\u00a7l\u00a7c你没有权限来执行命令!\u00a7`);
    if (cmd[1] == "add") add(cmd, e.sender);
    else if (cmd[1] == "set") set(cmd, e.sender);
    else if (cmd[1] == "name") name(cmd, e.sender);
    else if (cmd[1] == "clean") clean(cmd, e.sender);
    else if (cmd[1] == "additem") additem(cmd, e.sender);
    else e.sender.sendMessage(help);
  }
})