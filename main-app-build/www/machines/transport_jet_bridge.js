import { materials } from '../utils/materials.js';

export function createJetBridge(THREE) {
    const group = new THREE.Group();
    group.name = 'JetBridge';
    const animationClips = [];

    const metalMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.5, roughness: 0.5 });
    const glassMat = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    
    const rotundaGeo = new THREE.CylinderGeometry(3, 3, 6, 32);
    const rotunda = new THREE.Mesh(rotundaGeo, metalMat);
    rotunda.position.set(0, 5, 0);
    group.add(rotunda);

    const bridgePivot = new THREE.Group();
    bridgePivot.position.set(0, 5, 0);
    bridgePivot.name = 'BridgePivot';
    group.add(bridgePivot);

    const tunnelAGeo = new THREE.BoxGeometry(4, 4, 15);
    tunnelAGeo.translate(0, 0, 7.5);
    const tunnelA = new THREE.Mesh(tunnelAGeo, metalMat);
    bridgePivot.add(tunnelA);

    const tunnelBPivot = new THREE.Group();
    tunnelBPivot.position.set(0, 0, 14);
    tunnelBPivot.name = 'TunnelBPivot';
    bridgePivot.add(tunnelBPivot);

    const tunnelBGeo = new THREE.BoxGeometry(3.6, 3.6, 15);
    tunnelBGeo.translate(0, 0, 7.5);
    const tunnelB = new THREE.Mesh(tunnelBGeo, metalMat);
    tunnelBPivot.add(tunnelB);

    const tunnelAWindow = new THREE.Mesh(new THREE.PlaneGeometry(3, 14), glassMat);
    tunnelAWindow.rotation.y = Math.PI / 2;
    tunnelAWindow.position.set(2.05, 0, 7.5);
    tunnelA.add(tunnelAWindow);
    
    const tunnelBWindow = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 14), glassMat);
    tunnelBWindow.rotation.y = Math.PI / 2;
    tunnelBWindow.position.set(1.85, 0, 7.5);
    tunnelB.add(tunnelBWindow);

    const bogieGroup = new THREE.Group();
    bogieGroup.position.set(0, -2, 12);
    tunnelBPivot.add(bogieGroup);
    
    const wheelStand = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), metalMat);
    wheelStand.position.set(0, -2, 0);
    bogieGroup.add(wheelStand);
    
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheel1 = new THREE.Mesh(wheelGeo, rubberMat);
    wheel1.position.set(-1, -4, 0);
    bogieGroup.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeo, rubberMat);
    wheel2.position.set(1, -4, 0);
    bogieGroup.add(wheel2);

    const cabPivot = new THREE.Group();
    cabPivot.position.set(0, 0, 15);
    cabPivot.name = 'CabPivot';
    tunnelBPivot.add(cabPivot);

    const cabGeo = new THREE.CylinderGeometry(2.5, 2.5, 4, 32, 1, false, 0, Math.PI);
    cabGeo.rotateY(-Math.PI / 2);
    cabGeo.translate(0, 0, 0);
    const cab = new THREE.Mesh(cabGeo, metalMat);
    cabPivot.add(cab);
    
    const bumperGeo = new THREE.BoxGeometry(5, 4, 0.5);
    const bumper = new THREE.Mesh(bumperGeo, rubberMat);
    bumper.position.set(0, 0, 2.5);
    cabPivot.add(bumper);

    const extendTrack = new THREE.NumberKeyframeTrack('TunnelBPivot.position[z]', [0, 3, 6, 9], [14, 25, 25, 14]);
    const bridgeRotTrack = new THREE.NumberKeyframeTrack('BridgePivot.rotation[y]', [0, 3, 6, 9], [0, Math.PI / 6, Math.PI / 6, 0]);
    const cabRotTrack = new THREE.NumberKeyframeTrack('CabPivot.rotation[y]', [0, 3, 6, 9], [0, -Math.PI / 8, -Math.PI / 8, 0]);
    
    const clip = new THREE.AnimationClip('DockingSequence', 9, [extendTrack, bridgeRotTrack, cabRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
