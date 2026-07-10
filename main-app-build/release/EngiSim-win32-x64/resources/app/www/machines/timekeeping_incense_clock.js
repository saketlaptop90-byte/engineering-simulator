import { wood, brass, glass, gold } from '../utils/materials.js';

export function createIncenseClock(THREE) {
    const group = new THREE.Group();
    group.name = 'IncenseClock';

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 0.25;
    group.add(base);

    // Feet
    const footGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const positions = [
        [-1.8, 0, -1.8], [1.8, 0, -1.8],
        [-1.8, 0, 1.8], [1.8, 0, 1.8]
    ];
    positions.forEach(pos => {
        const foot = new THREE.Mesh(footGeo, brass);
        foot.position.set(...pos);
        group.add(foot);
    });

    // Incense Tray
    const trayGeo = new THREE.BoxGeometry(3.5, 0.2, 3.5);
    const tray = new THREE.Mesh(trayGeo, brass);
    tray.position.y = 0.6;
    group.add(tray);

    // Incense Path (Maze)
    const pathGroup = new THREE.Group();
    pathGroup.position.y = 0.75;
    
    // We'll create a simple spiral path out of boxes to represent the incense powder
    const incenseMat = new THREE.MeshStandardMaterial({color: 0x553311});
    const pathRadius = 1.5;
    for(let i=0; i<50; i++) {
        const angle = i * 0.4;
        const r = pathRadius * (1 - i/60);
        const chunk = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.2), incenseMat);
        chunk.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        chunk.rotation.y = -angle;
        pathGroup.add(chunk);
    }
    group.add(pathGroup);

    // Glowing ember (burn point)
    const emberGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const emberMat = new THREE.MeshBasicMaterial({color: 0xff3300});
    const emberGroup = new THREE.Group();
    emberGroup.name = 'EmberGroup';
    emberGroup.position.y = 0.8;
    
    const ember = new THREE.Mesh(emberGeo, emberMat);
    emberGroup.add(ember);

    // Smoke
    const smokeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.5});
    const smoke = new THREE.Mesh(smokeGeo, smokeMat);
    smoke.name = 'Smoke';
    emberGroup.add(smoke);

    group.add(emberGroup);

    // Animation: Ember moves along the spiral path
    const times = [];
    const values = [];
    
    for(let i=0; i<=50; i++) {
        const t = (i / 50) * 20; // 20 second loop
        times.push(t);
        
        const angle = i * 0.4;
        const r = pathRadius * (1 - i/60);
        const px = Math.cos(angle) * r;
        const pz = Math.sin(angle) * r;
        
        values.push(px, 0.8, pz);
    }

    const emberTrack = new THREE.VectorKeyframeTrack('EmberGroup.position', times, values);

    // Animate smoke puffing up locally inside EmberGroup
    const sTimes = [0, 0.5, 1];
    const sPos = [0, 0, 0,  0, 0.5, 0,  0, 1.0, 0];
    const sScale = [1,1,1,  2,2,2,  0,0,0];
    
    const smokePosTrack = new THREE.VectorKeyframeTrack('Smoke.position', sTimes, sPos);
    const smokeScaleTrack = new THREE.VectorKeyframeTrack('Smoke.scale', sTimes, sScale);

    const pathClip = new THREE.AnimationClip('IncenseBurn', 20, [emberTrack]);
    const smokeClip = new THREE.AnimationClip('SmokePuff', 1, [smokePosTrack, smokeScaleTrack]);

    return { group, animationClips: [pathClip, smokeClip] };
}
