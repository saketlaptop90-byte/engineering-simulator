import { yellowAccent, steel, darkSteel } from '../utils/materials.js';

export function createScissorLift(THREE) {
    const group = new THREE.Group();
    group.name = "ScissorLift";

    const base = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 3), darkSteel);
    base.position.y = 0.25;
    group.add(base);

    const platform = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 3), yellowAccent);
    platform.name = "Platform";
    platform.position.y = 4.0;
    group.add(platform);

    const numLevels = 3;
    const armLength = 5;
    
    const armsGroup = new THREE.Group();
    armsGroup.name = "Arms";
    group.add(armsGroup);

    const armGeo = new THREE.BoxGeometry(armLength, 0.2, 0.1);
    
    const tracks = [];
    const numFrames = 30;
    const duration = 4.0;
    
    const times = [];
    const platformPos = [];
    const armRotations = Array.from({length: numLevels * 2}, () => []);
    const armPositions = Array.from({length: numLevels * 2}, () => []);

    for (let f = 0; f <= numFrames; f++) {
        const t = f / numFrames;
        times.push(t * duration);
        
        const progress = (1 - Math.cos(t * Math.PI * 2)) / 2;
        const minTheta = 0.2;
        const maxTheta = 1.0;
        const theta = minTheta + progress * (maxTheta - minTheta);
        
        const h = armLength * Math.sin(theta);
        const w = armLength * Math.cos(theta);
        
        const platY = 0.5 + numLevels * h;
        platformPos.push(0, platY, 0);

        for (let lvl = 0; lvl < numLevels; lvl++) {
            const yBase = 0.5 + lvl * h;
            
            const centerX0 = 0;
            const centerY0 = yBase + h / 2;
            armPositions[lvl*2].push(centerX0, centerY0, 0);
            armRotations[lvl*2].push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), theta).toArray());
            
            const centerX1 = 0;
            const centerY1 = yBase + h / 2;
            armPositions[lvl*2 + 1].push(centerX1, centerY1, 0);
            armRotations[lvl*2 + 1].push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -theta).toArray());
        }
    }

    tracks.push(new THREE.VectorKeyframeTrack('Platform.position', times, platformPos));

    for (let side = 0; side < 2; side++) {
        const zOffset = side === 0 ? 1 : -1;
        
        for (let lvl = 0; lvl < numLevels; lvl++) {
            const idx0 = lvl * 2;
            const name0 = `Arm_${side}_${lvl}_0`;
            const arm0 = new THREE.Mesh(armGeo, steel);
            arm0.name = name0;
            const g0 = new THREE.Group();
            g0.name = name0 + '_Grp';
            g0.position.z = zOffset - 0.1;
            g0.add(arm0);
            group.add(g0);
            
            tracks.push(new THREE.VectorKeyframeTrack(`${name0}_Grp.position`, times, armPositions[idx0]));
            tracks.push(new THREE.QuaternionKeyframeTrack(`${name0}.quaternion`, times, armRotations[idx0]));
            
            const idx1 = lvl * 2 + 1;
            const name1 = `Arm_${side}_${lvl}_1`;
            const arm1 = new THREE.Mesh(armGeo, steel);
            arm1.name = name1;
            const g1 = new THREE.Group();
            g1.name = name1 + '_Grp';
            g1.position.z = zOffset + 0.1;
            g1.add(arm1);
            group.add(g1);
            
            tracks.push(new THREE.VectorKeyframeTrack(`${name1}_Grp.position`, times, armPositions[idx1]));
            tracks.push(new THREE.QuaternionKeyframeTrack(`${name1}.quaternion`, times, armRotations[idx1]));
            
            const pinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
            pinGeo.rotateX(Math.PI / 2);
            const pin = new THREE.Mesh(pinGeo, darkSteel);
            pin.name = `Pin_${side}_${lvl}`;
            pin.position.z = zOffset;
            const pinGrp = new THREE.Group();
            pinGrp.name = pin.name + '_Grp';
            pinGrp.add(pin);
            group.add(pinGrp);
            tracks.push(new THREE.VectorKeyframeTrack(`${pin.name}_Grp.position`, times, armPositions[idx0]));
        }
    }

    const hydBase = new THREE.Group();
    hydBase.name = "HydBase";
    hydBase.position.set(-2, 0.5, 0);
    group.add(hydBase);
    
    const cylGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
    cylGeo.translate(0, 1.5, 0);
    const cylinder = new THREE.Mesh(cylGeo, yellowAccent);
    hydBase.add(cylinder);

    const pistonGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 32);
    pistonGeo.translate(0, 1.5, 0);
    const piston = new THREE.Mesh(pistonGeo, steel);
    piston.name = "Piston";
    hydBase.add(piston);

    const hydRots = [];
    const pistonScales = [];
    for (let f = 0; f <= numFrames; f++) {
        const cx = armPositions[0][f * 3];
        const cy = armPositions[0][f * 3 + 1];
        
        const dx = cx - (-2);
        const dy = cy - 0.5;
        const angle = Math.atan2(dy, dx) - Math.PI / 2;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        hydRots.push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle).toArray());
        
        const ext = dist / 3.0;
        pistonScales.push(1, ext, 1);
    }
    
    tracks.push(new THREE.QuaternionKeyframeTrack('HydBase.quaternion', times, hydRots));
    tracks.push(new THREE.VectorKeyframeTrack('Piston.scale', times, pistonScales));

    const clip = new THREE.AnimationClip('Lift', duration, tracks);

    return { group, animationClips: [clip] };
}
