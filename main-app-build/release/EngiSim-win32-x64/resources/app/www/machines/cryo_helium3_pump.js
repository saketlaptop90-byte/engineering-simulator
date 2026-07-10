import { steelMaterial, copperMaterial, cryogenMaterial } from '../utils/materials.js';

export function createHelium3RecirculationPump(THREE) {
    const group = new THREE.Group();
    group.name = "Helium3RecirculationPump";
    const animationClips = [];

    // Pump Body
    const bodyGeo = new THREE.CylinderGeometry(3, 3, 6, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6, metalness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, steelMaterial || bodyMat);
    group.add(body);

    // Cooling Fans / Impeller
    const fanGroup = new THREE.Group();
    fanGroup.name = "Impeller";
    fanGroup.position.y = 3.5;
    
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const hub = new THREE.Mesh(hubGeo, bodyMat);
    fanGroup.add(hub);

    for(let i=0; i<6; i++) {
        const bladeGeo = new THREE.BoxGeometry(2.5, 0.1, 0.5);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.x = 1.5;
        
        const pivot = new THREE.Group();
        pivot.rotation.y = (i / 6) * Math.PI * 2;
        pivot.add(blade);
        fanGroup.add(pivot);
    }
    group.add(fanGroup);

    // Helium Flow Indicators (particles/spheres)
    const flowGroup = new THREE.Group();
    flowGroup.name = "HeliumFlow";
    for(let i=0; i<20; i++) {
        const hGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const hMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, transparent: true, opacity: 0.6 });
        const h = new THREE.Mesh(hGeo, cryogenMaterial || hMat);
        h.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*6, (Math.random()-0.5)*4);
        h.name = `helium_${i}`;
        flowGroup.add(h);
    }
    group.add(flowGroup);

    // Animations: Impeller rotation and helium flow
    const times = [0, 2];
    const fanTrack = new THREE.NumberKeyframeTrack('Impeller.rotation[y]', times, [0, Math.PI * 4]);
    
    const tracks = [fanTrack];
    for(let i=0; i<20; i++) {
        const hTrack = new THREE.VectorKeyframeTrack(
            `helium_${i}.position`,
            [0, 1, 2],
            [
                (Math.random()-0.5)*4, -3, (Math.random()-0.5)*4,
                (Math.random()-0.5)*4, 0, (Math.random()-0.5)*4,
                (Math.random()-0.5)*4, 3, (Math.random()-0.5)*4
            ]
        );
        tracks.push(hTrack);
    }

    const clip = new THREE.AnimationClip('PumpOperation', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
