export function createScatterPlotRegression(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const numPoints = 100;
    const pointsGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const pointsMat = new THREE.MeshStandardMaterial({color: 0x22cc22});
    
    for (let i=0; i<numPoints; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = 0.5 * x + 1 + (Math.random() - 0.5) * 2;
        const z = (Math.random() - 0.5) * 2;
        const point = new THREE.Mesh(pointsGeo, pointsMat);
        point.position.set(x, y, z);
        group.add(point);
    }
    
    const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 15, 8);
    lineGeo.rotateZ(Math.PI / 2); 
    const lineMat = new THREE.MeshStandardMaterial({color: 0xff0000});
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.name = "regressionLine";
    group.add(line);
    
    const targetAngle = Math.atan(0.5);
    
    const times = [0, 2, 4];
    const posValues = [
        0, -3, 0,
        0, 1, 0,
        0, 1, 0
    ];
    
    const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -0.5);
    const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), targetAngle);
    
    const rotValues = [
        qStart.x, qStart.y, qStart.z, qStart.w,
        qEnd.x, qEnd.y, qEnd.z, qEnd.w,
        qEnd.x, qEnd.y, qEnd.z, qEnd.w
    ];
    
    const posTrack = new THREE.VectorKeyframeTrack('regressionLine.position', times, posValues);
    const rotTrack = new THREE.QuaternionKeyframeTrack('regressionLine.quaternion', times, rotValues);
    
    const clip = new THREE.AnimationClip('regressionAnim', 4, [posTrack, rotTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
