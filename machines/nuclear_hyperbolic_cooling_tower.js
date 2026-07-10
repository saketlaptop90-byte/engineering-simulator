import * as sharedMaterials from '../utils/materials.js';

export function createHyperbolicCoolingTower(THREE) {
    const group = new THREE.Group();
    
    // Materials with fallback
    const concreteMat = sharedMaterials.concrete || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
    const steamMat = sharedMaterials.steam || new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    
    // Hyperboloid structure
    const points = [];
    for ( let i = 0; i <= 20; i ++ ) {
        const y = (i / 20) * 30 - 15;
        const x = 10 + Math.pow(y / 15, 2) * 5; 
        points.push( new THREE.Vector2( x, y ) );
    }
    const towerGeo = new THREE.LatheGeometry( points, 32 );
    const tower = new THREE.Mesh( towerGeo, concreteMat );
    group.add( tower );
    
    // Steam particles
    const steamGroup = new THREE.Group();
    steamGroup.position.y = 15;
    group.add(steamGroup);
    
    const steamMeshes = [];
    for (let i = 0; i < 30; i++) {
        const steamGeo = new THREE.SphereGeometry(2 + Math.random()*3, 8, 8);
        // We clone material so opacity can be animated independently if needed, or we animate scale
        const sMat = steamMat.clone();
        const steamMesh = new THREE.Mesh(steamGeo, sMat);
        steamMesh.position.set((Math.random()-0.5)*15, Math.random()*5, (Math.random()-0.5)*15);
        steamGroup.add(steamMesh);
        steamMeshes.push(steamMesh);
    }
    
    // Animation: Steam rising and dissipating
    const tracks = [];
    steamMeshes.forEach(mesh => {
        const duration = 2 + Math.random() * 3;
        const times = [0, duration/2, duration];
        const startY = mesh.position.y;
        const endY = startY + 15 + Math.random() * 5;
        
        const posTrack = new THREE.NumberKeyframeTrack(mesh.uuid + '.position[y]', times, [startY, startY + (endY-startY)/2, endY]);
        const opTrack = new THREE.NumberKeyframeTrack(mesh.uuid + '.material.opacity', times, [0.0, 0.6, 0.0]);
        
        tracks.push(posTrack, opTrack);
    });
    
    const clip = new THREE.AnimationClip('SteamRise', 5, tracks);
    
    return { group, animationClips: [clip] };
}
