import { materials } from '../utils/materials.js';

export function createArticulatedBusJoint(THREE) {
    const group = new THREE.Group();
    group.name = 'ArticulatedBus';
    const animationClips = [];

    const bodyMat = materials.paint || new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.2 });
    const rubberMat = materials.rubber || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const metalMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 });
    const glassMat = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0x111111, transmission: 0.5, transparent: true });

    const width = 3;
    const height = 3.5;
    const clearance = 0.5;
    const sectionLength = 8;

    const frontGroup = new THREE.Group();
    frontGroup.name = 'FrontSection';
    group.add(frontGroup);

    const frontBodyGeo = new THREE.BoxGeometry(width, height, sectionLength);
    frontBodyGeo.translate(0, height/2 + clearance, sectionLength/2);
    const frontBody = new THREE.Mesh(frontBodyGeo, bodyMat);
    frontGroup.add(frontBody);
    
    const windowGeo = new THREE.PlaneGeometry(width + 0.05, 1.5);
    const frontWindow = new THREE.Mesh(windowGeo, glassMat);
    frontWindow.rotation.y = Math.PI / 2;
    frontWindow.position.set(width/2, height/2 + clearance + 0.5, sectionLength/2);
    frontGroup.add(frontWindow);

    const jointPivot = new THREE.Group();
    jointPivot.position.set(0, 0, 0); 
    jointPivot.name = 'JointPivot';
    group.add(jointPivot);

    const rearBodyGeo = new THREE.BoxGeometry(width, height, sectionLength);
    rearBodyGeo.translate(0, height/2 + clearance, -sectionLength/2);
    const rearBody = new THREE.Mesh(rearBodyGeo, bodyMat);
    jointPivot.add(rearBody);

    const bellowsGroup = new THREE.Group();
    bellowsGroup.name = 'Bellows';
    group.add(bellowsGroup);

    const numFolds = 8;
    const foldDepth = 1.2 / numFolds;
    const folds = [];

    for (let i = 0; i < numFolds; i++) {
        const foldGeo = new THREE.BoxGeometry(width + 0.2, height + 0.2, foldDepth * 0.8);
        const fold = new THREE.Mesh(foldGeo, rubberMat);
        fold.position.set(0, height/2 + clearance, (i - numFolds/2) * foldDepth);
        fold.name = `Fold_${i}`;
        bellowsGroup.add(fold);
        folds.push(fold);
    }

    const turntableGeo = new THREE.CylinderGeometry(width/2 - 0.1, width/2 - 0.1, 0.2, 32);
    const turntable = new THREE.Mesh(turntableGeo, metalMat);
    turntable.position.set(0, clearance + 0.1, 0);
    group.add(turntable);

    const jointTrack = new THREE.NumberKeyframeTrack('JointPivot.rotation[y]', [0, 2, 4, 6, 8], [0, Math.PI / 6, 0, -Math.PI / 6, 0]);
    
    const foldTracks = [];
    folds.forEach((fold, i) => {
        const t = (i + 0.5) / numFolds;
        
        const rotValues = [
            0,
            (Math.PI / 6) * t,
            0,
            (-Math.PI / 6) * t,
            0
        ];
        
        foldTracks.push(new THREE.NumberKeyframeTrack(`Fold_${i}.rotation[y]`, [0, 2, 4, 6, 8], rotValues));
        
        const baseZ = (i - numFolds/2) * foldDepth;
        const xValues = [
            0,
            Math.sin((Math.PI / 6) * t) * baseZ,
            0,
            Math.sin((-Math.PI / 6) * t) * baseZ,
            0
        ];
        const zValues = [
            baseZ,
            Math.cos((Math.PI / 6) * t) * baseZ,
            baseZ,
            Math.cos((-Math.PI / 6) * t) * baseZ,
            baseZ
        ];
        
        const posValues = [];
        for(let j=0; j<5; j++) {
            posValues.push(xValues[j], height/2 + clearance, zValues[j]);
        }
        
        foldTracks.push(new THREE.VectorKeyframeTrack(`Fold_${i}.position`, [0, 2, 4, 6, 8], posValues));
    });

    const clip = new THREE.AnimationClip('BusTurning', 8, [jointTrack, ...foldTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
