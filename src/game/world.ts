import { Graphics, System } from "cleo";
import { Camera } from "../libs/core/camera";
import { HashGrid2D } from "../libs/core/data";
import { Ldtk } from "../libs/ldtk/ldtk";
import { HEIGHT, WIDTH } from "./globals";
import { AABB } from "../libs/core/aabb";
import { Vec2 } from "../libs/core/la";
import { Player } from "./player";

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
        this.player.position.x = WIDTH/2; this.player.position.y = HEIGHT/2;
        this.collisionLookup = new HashGrid2D(0);
        for (const sector of sectorLookup.data.values()) {
            if(!sector) continue;
            this.drawSector(sector);
            this.addSectorCollision(sector);
        }
    }
    update(dt: number){
        this.player.update(dt);
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
            this.player.draw();
        });
    }
    /**
    Mutates velocity and position in place.
    */
    moveAndSlide(dt: number, velocity: Vec2, aabb: AABB){
        const cx = Math.floor(aabb.position.x / this.cellWidthPx);
        const cy = Math.floor(aabb.position.y / this.cellWidthPx);
        aabb.position.addMutate(velocity.mul(dt));
        let minX = -Infinity;
        let minY = -Infinity;
        let maxX = Infinity;
        let maxY = Infinity;
        if(this.collisionLookup.get(cx - 1, cy)) minX = cx * this.cellWidthPx;
        if(this.collisionLookup.get(cx + 1, cy)) maxX = cx * this.cellWidthPx;
        if(aabb.position.x < minX){
            velocity.x = 0;
            aabb.position.x = minX;
        }
        else if(aabb.position.x > maxX){
            velocity.x = 0;
            aabb.position.x = maxX;
        }
        if(this.collisionLookup.get(cx, cy - 1)) minY = cy * this.cellWidthPx;
        if(this.collisionLookup.get(cx, cy + 1)) maxY = cy * this.cellWidthPx;
        if(aabb.position.y < minY){
            velocity.y = 0;
            aabb.position.y = minY;
        }
        else if(aabb.position.y > maxY){
            velocity.y = 0;
            aabb.position.y = maxY;
        }
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
                    sector = {posX: sx, posY: sy, cells: []};
                    sectorLookup.set(sx, sy, sector);
                }
                sector.cells.push(intGrid[idx]);
            }
            rooms.add({posX: roomXSectors, posY: roomYSectors, width: roomWidthSectors, height: roomHeightSectors, properties: new Map()});
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
}

interface Sector{
    posX: number;
    posY: number;
    cells: number[];
    texture?: Graphics.Texture;
}