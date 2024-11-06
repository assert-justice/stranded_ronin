import { Graphics, System } from "cleo";
import { HashGrid2D } from "../libs/core/data";
import { Ldtk } from "../libs/ldtk/ldtk";
import { HEIGHT, WIDTH } from "./globals";
import { AABB } from "../libs/core/aabb";
import { Vec2 } from "../libs/core/la";
import { Player } from "./player";
import { Camera } from "../libs/core/camera";
import { Pool } from "../libs/core/pool";
import { Target } from "./target";
import { Bullet } from "./bullet";
import { Hud } from "./hud";

export class World{
    rooms: Set<Room>;
    sectorLookup: HashGrid2D<Sector | undefined>;
    collisionLookup: HashGrid2D<number>;
    cellWidthPx: number;
    sectorWidthCells: number;
    sectorHeightCells: number;
    camera: Camera;
    brown: Graphics.Texture;
    wall: Graphics.Texture;
    player: Player;
    currentSector?: Sector;
    currentRoom?: Room;
    targets: Pool;
    playerBullets: Pool;
    hud: Hud;
    constructor(rooms: Set<Room>, sectorLookup: HashGrid2D<Sector | undefined>, cellWidthPx: number, sectorWidthCells: number, sectorHeightCells: number){
        this.rooms = rooms;
        this.sectorLookup = sectorLookup;
        this.cellWidthPx = cellWidthPx;
        this.sectorWidthCells = sectorWidthCells;
        this.sectorHeightCells = sectorHeightCells;
        this.camera = new Camera(WIDTH, HEIGHT);
        this.brown = Graphics.Texture.fromColor(WIDTH, HEIGHT, 139, 69, 19, 255);
        this.wall = Graphics.Texture.fromColor(14, 14, 100, 100, 100, 255);
        this.player = new Player(this);
        this.collisionLookup = new HashGrid2D(0);
        this.targets = new Pool(()=> new Target(this));
        this.playerBullets = new Pool(() => new Bullet(this));
        this.hud = new Hud(this);
        for (const room of rooms) {
            // spawn entities
            for (const ent of room.entities) {
                if(ent.name === "Game_Start"){
                    this.player.position = new Vec2(ent.posX, ent.posY);
                    this.camera.position.x = Math.floor(this.player.position.x/WIDTH) * WIDTH + WIDTH/2;
                    this.camera.position.y = Math.floor(this.player.position.y/HEIGHT) * HEIGHT + HEIGHT/2;
                }
                // else if(ent.name === "Spawner"){
                //     const type = ent.properties.get('Type');
                //     if(!type) continue;
                //     if(type === 'Target'){
                //         const target = this.targets.getNew();
                //         target.position.x = ent.posX;
                //         target.position.y = ent.posY;
                //     }
                // }
            }
        }
    }
    update(dt: number){
        const sx = Math.floor(this.player.position.x / this.sectorWidthCells / this.cellWidthPx);
        const sy = Math.floor(this.player.position.y / this.sectorHeightCells / this.cellWidthPx);
        this.currentSector = this.sectorLookup.get(sx, sy);
        if(this.currentSector){
            const sw = this.sectorWidthCells*this.cellWidthPx;
            const sh = this.sectorHeightCells*this.cellWidthPx;
            const room = this.currentSector.room;
            if(room != this.currentRoom){
                // render needed segments
                for (const sector of room.sectors) {
                    this.drawSector(sector);
                    this.addSectorCollision(sector);
                }
                this.targets.clear();
                for (const ent of room.entities) {
                    if(ent.name === "Spawner"){
                        const type = ent.properties.get("Type");
                        if(type === "Target"){
                            const target = this.targets.getNew();
                            target.position.x = ent.posX;
                            target.position.y = ent.posY;
                        }
                    }
                }
            }
            this.currentRoom = room;
            this.camera.minX = room.posX * sw + WIDTH/2;
            this.camera.minY = room.posY * sh + HEIGHT/2;
            this.camera.maxX = (room.posX + room.width) * sw - WIDTH/2;
            this.camera.maxY = (room.posY + room.height) * sh - HEIGHT/2;
        }
        else{
            this.camera.resetExtents();
        }
        this.camera.targetPosition = this.player.position.copy();
        this.camera.update(dt);
        if(this.camera.isOob(this.camera.position)) return;
        this.player.update(dt);
        this.targets.update(dt);
        this.playerBullets.update(dt);
        this.hud.update();
    }
    draw(){
        this.camera.draw(0, 0, ()=>{
            const sw = this.sectorWidthCells*this.cellWidthPx;
            const sh = this.sectorHeightCells*this.cellWidthPx;
            for (const val of this.sectorLookup.data.values()) {
                if(!val) continue;
                if(!val.texture) continue;
                val.texture.draw(val.posX*sw, val.posY*sh);
            }
            this.targets.draw();
            this.player.draw();
            this.playerBullets.draw();
        });
        this.hud.draw();
    }
    isSolid(pos: Vec2){
        const cx = Math.floor(pos.x / this.cellWidthPx);
        const cy = Math.floor(pos.y / this.cellWidthPx);
        return this.isCellSolid(cx, cy);
    }
    isCellSolid(cx: number, cy: number){
        return !!this.collisionLookup.get(cx, cy);
    }
    /**
    Mutates velocity and position in place.
    */
    moveAndSlide(dt: number, velocity: Vec2, aabb: AABB){
        const cx = Math.floor(aabb.position.x / this.cellWidthPx);
        const cy = Math.floor(aabb.position.y / this.cellWidthPx);
        const pos = aabb.position.copy();
        pos.addMutate(aabb.offset).addMutate(velocity.mul(dt));
        let minX = -Infinity;
        let minY = -Infinity;
        let maxX = Infinity;
        let maxY = Infinity;
        if(this.isCellSolid(cx - 1, cy)) minX = cx * this.cellWidthPx;
        if(this.isCellSolid(cx + 1, cy)) maxX = cx * this.cellWidthPx;
        if(pos.x < minX){
            velocity.x = 0;
            pos.x = minX;
        }
        else if(pos.x > maxX){
            velocity.x = 0;
            pos.x = maxX;
        }
        if(this.collisionLookup.get(cx, cy - 1)) minY = cy * this.cellWidthPx;
        if(this.collisionLookup.get(cx, cy + 1)) maxY = cy * this.cellWidthPx;
        if(pos.y < minY){
            velocity.y = 0;
            pos.y = minY;
        }
        else if(pos.y > maxY){
            velocity.y = 0;
            pos.y = maxY;
        }
        pos.subMutate(aabb.offset);
        aabb.position.x = pos.x;
        aabb.position.y = pos.y;
    }
    addSectorCollision(sector: Sector){
        const xOffset = sector.posX * this.sectorWidthCells;
        const yOffset = sector.posY * this.sectorHeightCells;
        for(let idx = 0; idx < sector.cells.length; idx++){
            const id = sector.cells[idx];
            if(id === 0) continue;
            const cx = idx % this.sectorWidthCells + xOffset;
            const cy = Math.floor(idx / this.sectorWidthCells) + yOffset;
            this.collisionLookup.set(cx, cy, 1);
        }
    }
    private drawSector(sector: Sector){
        const sw = this.sectorWidthCells*this.cellWidthPx;
        const sh = this.sectorHeightCells*this.cellWidthPx;
        if(!sector.texture){
            sector.texture = Graphics.Texture.new(sw, sh);
        }
        Graphics.pushRenderTarget(sector.texture);
        Graphics.clear();
        this.brown.draw(0, 0);
        for(let idx = 0; idx < sector.cells.length; idx++){
            const id = sector.cells[idx];
            if(id === 0) continue;
            const cx = idx % this.sectorWidthCells;
            const cy = Math.floor(idx / this.sectorWidthCells);
            this.wall.draw(cx * this.cellWidthPx + 1, cy * this.cellWidthPx + 1);
        }
        Graphics.popRenderTarget();
    }
    static fromLdtk(data: Ldtk){
        const cellWidthPx = data.defaultGridSize;
        const sectorWidthPx = (data.defaultLevelWidth ?? 0);
        const sectorHeightPx = (data.defaultLevelHeight ?? 0);
        const sectorWidthCells = sectorWidthPx / cellWidthPx;
        const sectorHeightCells = sectorHeightPx / cellWidthPx;
        const rooms = new Set<Room>();
        const sectorLookup = new HashGrid2D<Sector | undefined>(undefined);
        for (const level of data.levels) {
            const roomWidthSectors = level.pxWid / sectorWidthPx;
            const roomHeightSectors = level.pxHei / sectorHeightPx;
            const roomWidthCells = roomWidthSectors * sectorWidthCells;
            const roomXSectors = level.worldX / sectorWidthPx;
            const roomYSectors = level.worldY / sectorHeightPx;
            const room: Room = {
                posX: roomXSectors, 
                posY: roomYSectors, 
                width: roomWidthSectors, 
                height: roomHeightSectors, 
                properties: new Map(),
                entities: [],
                sectors: [],
            };
            const layers = level.layerInstances;
            if(!layers) throw 'validation error';
            const intGrid = layers[0].intGridCsv;
            for(let idx = 0; idx < intGrid.length; idx++){
                const cx = idx % roomWidthCells;
                const cy = Math.floor(idx / roomWidthCells);
                const sx = Math.floor(cx / sectorWidthCells) + roomXSectors;
                const sy = Math.floor(cy / sectorHeightCells) + roomYSectors;
                let sector = sectorLookup.get(sx, sy);
                if(!sector){
                    sector = {posX: sx, posY: sy, cells: [], room};
                    room.sectors.push(sector);
                    sectorLookup.set(sx, sy, sector);
                }
                sector.cells.push(intGrid[idx]);
            }
            const entities = layers[1].entityInstances;
            for (const ent of entities) {
                const summary: EntitySummary = {
                    id: ent.defUid,
                    posX: ent.__worldX ?? 0,
                    posY: ent.__worldY ?? 0,
                    name: ent.__identifier,
                    properties: new Map(),
                };
                room.entities.push(summary);
                for (const field of ent.fieldInstances) {
                    summary.properties.set(field.__identifier, ''+field.__value);
                }
            }
            rooms.add(room);
        }
        return new World(rooms, sectorLookup, cellWidthPx, sectorWidthCells, sectorHeightCells);
    }
}

interface Room{
    posX: number;
    posY: number;
    width: number;
    height: number;
    properties: Map<string, string>;
    entities: EntitySummary[];
    sectors: Sector[];
}

interface Sector{
    posX: number;
    posY: number;
    cells: number[];
    texture?: Graphics.Texture;
    room: Room;
}

interface EntitySummary{
    id: number;
    posX: number;
    posY: number;
    name: string;
    properties: Map<string, string>;
}