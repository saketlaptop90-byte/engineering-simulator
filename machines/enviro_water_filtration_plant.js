import * as materials from '../utils/materials.js';

export function createAdvancedWaterFiltrationPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ground/Facility Base
    const baseGeo = new THREE.PlaneGeometry(20, 20);
    const baseMat = materials.concreteMaterial || new THREE.MeshStandardMaterial({ color: 0x666666 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    group.add(base);

    // Filtration Tanks (Multiple stages)
    const tankGeo = new THREE.CylinderGeometry(2, 2, 5, 32);
    const tankColors = [0x553311, 0x775533, 0x99aaff, 0x00ffff]; // Representing dirty to clean
    
    for (let i = 0; i < 4; i++) {
        const tankMat = materials[`tankMaterial${i}`] || new THREE.MeshStandardMaterial({ color: tankColors[i], transparent: true, opacity: 0.8 });
        const tank = new THREE.Mesh(tankGeo, tankMat);
        tank.position.set(-6 + i * 4, 2.5, 0);
        group.add(tank);

        // Water level animation plane inside tank
        const waterGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.1, 32);
        const waterMat = materials.waterMaterial || new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.6 });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.name = `waterLevel_${i}`;
        water.position.set(-6 + i * 4, 0.5, 0);
        group.add(water);

        const track = new THREE.VectorKeyframeTrack(
            `waterLevel_${i}.position`,
            [0, 2, 4],
            [
                -6 + i * 4, 0.5, 0,
                -6 + i * 4, 4.5, 0,
                -6 + i * 4, 0.5, 0
            ]
        );
        animationClips.push(new THREE.AnimationClip(`FillEmptyTank_${i}`, 4, [track]));
    }

    // Connecting Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const pipeMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0xcccccc });
    for (let i = 0; i < 3; i++) {
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(-4 + i * 4, 1, 0);
        group.add(pipe);
    }

    // UV Sterilization Unit
    const uvGeo = new THREE.BoxGeometry(3, 3, 3);
    const uvMat = materials.uvMaterial || new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const uvUnit = new THREE.Mesh(uvGeo, uvMat);
    uvUnit.position.set(6, 1.5, 4);
    group.add(uvUnit);
    
    const pipeToUV = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 16), pipeMat);
    pipeToUV.rotation.x = Math.PI / 2;
    pipeToUV.position.set(6, 1, 2);
    group.add(pipeToUV);

    return { group, animationClips };
}
