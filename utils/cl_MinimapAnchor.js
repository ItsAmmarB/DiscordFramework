// Original Function | courtesy of GLITCHDETECTOR  (https://github.com/glitchdetector/fivem-minimap-anchor)
// Wide Screen Support | courtesy of Ruben  (https://gitlab.com/inkietud-rp/fivem-minimap-anchors)
const GetMinimapAnchor = () => {

    const safezone = GetSafeZoneSize();
    const safezone_x = 1.0 / 20.0;
    const safezone_y = 1.0 / 20.0;

    let aspect_ratio = GetAspectRatio(0);

    if (aspect_ratio > 2) aspect_ratio = 16 / 9;

    const [res_x, res_y] = GetActiveScreenResolution();
    const xscale = 1.0 / res_x;
    const yscale = 1.0 / res_y;
    const Minimap = {};

    Minimap.width = xscale * (res_x / (4 * aspect_ratio));
    Minimap.height = yscale * (res_y / 5.674);
    Minimap.left_x = xscale * (res_x * (safezone_x * ((Math.abs(safezone - 1.0)) * 10)));

    if (GetAspectRatio(0) > 2) {

        Minimap.left_x = Minimap.left_x + Minimap.width * 0.845;
        Minimap.width = Minimap.width * 0.76;

    } else if (GetAspectRatio(0) > 1.8) {

        Minimap.left_x = Minimap.left_x + Minimap.width * 0.2225;
        Minimap.width = Minimap.width * 0.995;
    }

    Minimap.bottom_y = 1.0 - yscale * (res_y * (safezone_y * ((Math.abs(safezone - 1.0)) * 10)));
    Minimap.right_x = Minimap.left_x + Minimap.width;
    Minimap.top_y = Minimap.bottom_y - Minimap.height;
    Minimap.x = Minimap.left_x;
    Minimap.y = Minimap.top_y;
    Minimap.xunit = xscale;
    Minimap.yunit = yscale;

    return Minimap;

};

exports('Functions.GetMinimapAnchor', () => GetMinimapAnchor());
