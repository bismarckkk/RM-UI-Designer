#include "ui.h"
#include "serialib.h"
#include "serial.h"

#include <chrono>
#include <thread>

serialib serial;

int main() {
    serial.openDevice("COM1", 115200);
    ui_self_id = 2;
    ui_init_default_Ungroup();

    for (int i = 0; i < 100; i++) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        ui_default_Ungroup_NewLine->start_x += 2;
        ui_default_Ungroup_NewLine->start_y -= 2;
        ui_default_Ungroup_NewRect->start_x -= 2;
        ui_default_Ungroup_NewRect->start_y += 2;
        ui_default_Ungroup_NewText->start_x += 2;
        ui_default_Ungroup_NewText->start_y += 2;
        ui_update_default_Ungroup();
    }

    ui_remove_default_Ungroup();

    serial.closeDevice();
    return 0;
}

void write(uint8_t* msg, int len) {
    serial.writeBytes(msg, len);
}
