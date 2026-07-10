import { metals, polymers } from '../utils/materials.js';

export function createShapeMemoryAlloy(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const baseMat = metals ? metals.steel : new THREE.MeshStandardMaterial({ color: 0x888888 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -2;
    group.add(base);

    // SMA Wire/Spring
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(0.5, -1, 0),
        new THREE.Vector3(-0.5, 0, 0),
        new THREE.Vector3(0.5, 1, 0),
        new THREE.Vector3(0, 2, 0)
    ]);
    const wireGeo = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
    const wireMat = metals ? metals.titanium : new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.name = 'smaWire';
    group.add(wire);

    // Top mounting plate
    const topGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const topMat = metals ? metals.steel : new THREE.MeshStandardMaterial({ color: 0x888888 });
    const topPlate = new THREE.Mesh(topGeo, topMat);
    topPlate.position.y = 2;
    topPlate.name = 'topPlate';
    group.add(topPlate);

    // Animation: Shrink and expand (shape memory effect under heat)
    // We animate scale.y of the wire and maybe change its color slightly to simulate heat
    const wireScaleTrack = new THREE.VectorKeyframeTrack(
        'smaWire.scale',
        [0, 1, 2, 3],
        [1, 1, 1,  1, 0.5, 1,  1, 1, 1,  1, 0.5, 1] // x,y,z
    );
    const colorTrack = new THREE.ColorKeyframeTrack(
        'smaWire.material.color',
        [0, 1, 2, 3],
        [0.7, 0.7, 0.7,  1.0, 0.2, 0.2,  0.7, 0.7, 0.7,  1.0, 0.2, 0.2] // Simulate heating up to red
    );
    const topPlatePosTrack = new THREE.VectorKeyframeTrack(
        'topPlate.position',
        [0, 1, 2, 3],
        [0, 2, 0,  0, 0, 0,  0, 2, 0,  0, 0, 0] // Moving top plate down with the wire
    );
    
    const clip = new THREE.AnimationClip('HeatAndContract', 3, [wireScaleTrack, colorTrack, topPlatePosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
