import { concrete, darkSteel, glass, glowing } from '../utils/materials.js';

export function createCoolingTower(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const points = [];
    for (let i = 0; i <= 10; i++) {
        const y = i * 2;
        const x = 5 + Math.pow(i - 5, 2) * 0.1; 
        points.push(new THREE.Vector2(x, y));
    }
    const towerGeometry = new THREE.LatheGeometry(points, 32);
    const tower = new THREE.Mesh(towerGeometry, concrete);
    group.add(tower);

    const steamGroup = new THREE.Group();
    const steamGeo = new THREE.SphereGeometry(1, 8, 8);
    const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    
    for(let i=0; i<20; i++) {
        const steam = new THREE.Mesh(steamGeo, steamMat);
        steam.position.set((Math.random() - 0.5) * 6, Math.random() * 20, (Math.random() - 0.5) * 6);
        steamGroup.add(steam);
    }
    group.add(steamGroup);

    const times = [0, 5];
    const values = [0, 0, 0, 0, 5, 0];
    const steamTrack = new THREE.VectorKeyframeTrack(steamGroup.uuid + '.position', times, values);
    const steamClip = new THREE.AnimationClip('SteamRise', 5, [steamTrack]);
    animationClips.push(steamClip);

    return { group, animationClips };
}
