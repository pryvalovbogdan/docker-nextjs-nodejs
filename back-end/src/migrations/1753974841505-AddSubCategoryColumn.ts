import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubCategoryColumn1753974841508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add path columns
    await queryRunner.query(`
      ALTER TABLE categories ADD COLUMN path VARCHAR(255) UNIQUE;
    `);

    await queryRunner.query(`
      ALTER TABLE subcategories ADD COLUMN path VARCHAR(255) UNIQUE;
    `);

    // 2. Update categories with English transliterations (example for some)
    await queryRunner.query(`
      UPDATE categories SET path = CASE name
        WHEN 'Хірургія' THEN 'surgery'
        WHEN 'Кардіологія' THEN 'cardiology'
        WHEN 'Реанімація' THEN 'resuscitation'
        WHEN 'Меблі для медичних закладів' THEN 'medical-furniture'
        WHEN 'Фізіотерапевтичне та реабілітаційне обладнання' THEN 'physiotherapy-rehabilitation'
        WHEN 'Офтальмологія' THEN 'ophthalmology'
        WHEN 'Обладнання для неонатології, акушерства, гінекології' THEN 'neonatology-obstetrics-gynecology'
        WHEN 'Кисневе обладнання' THEN 'oxygen-equipment'
        WHEN 'Стерилізація' THEN 'sterilization'
        WHEN 'Лабораторне обладнання' THEN 'laboratory-equipment'
        WHEN 'Ендоскопічне обладнання' THEN 'endoscopy-equipment'
        WHEN 'Радіологія' THEN 'radiology'
        WHEN 'УЗД' THEN 'ultrasound'
        WHEN 'Лазери медичні' THEN 'medical-lasers'
        WHEN 'ЛОР' THEN 'ent'
        WHEN 'Стоматологія' THEN 'dentistry'
        WHEN 'Косметологія та дерматологія' THEN 'cosmetology-dermatology'
        WHEN 'Б/в обладнання' THEN 'used-equipment'
      END
      WHERE path IS NULL;
    `);

    // 3. Update subcategories with English transliterations (example for some)
    await queryRunner.query(`
      UPDATE subcategories SET path = CASE name
                                          WHEN 'Операційні столи' THEN 'surgical-tables'
                                          WHEN 'Операційні світильники' THEN 'surgical-lights'
                                          WHEN 'Відсмоктувачі хірургічні' THEN 'surgical-suction'
                                          WHEN 'Інфузійне обладнання' THEN 'infusion-equipment'
                                          WHEN 'Операційні мікроскопи' THEN 'surgical-microscopes'
                                          WHEN 'Електрохірургія' THEN 'electrosurgery'
                                          WHEN 'Нейрохірургія' THEN 'neurosurgery'
                                          WHEN 'Хірургічні інструменти' THEN 'surgical-instruments'
                                          WHEN 'Набори інструментів' THEN 'instrument-kits'
          
                                          WHEN 'Діодні хірургічні лазери' THEN 'diode-surgical-lasers'
                                          WHEN 'Хірургічні лазери' THEN 'surgical-lasers'
          
                                          WHEN 'Електрокардіографи' THEN 'ecg-machines'
                                          WHEN 'Монітори пацієнтів' THEN 'patient-monitors'
                                          WHEN 'Холтери ЕКГ та АТ' THEN 'ecg-holters'
                                          WHEN 'Зовнішні кардіостимулятори' THEN 'external-pacemakers'
                                          WHEN 'Пояси для ЕКГ' THEN 'ecg-belts'
                                          WHEN 'Апарати штучної вентиляції легенів' THEN 'ventilators'
                                          WHEN 'Апарати наркозно-дихальні' THEN 'anesthesia-devices'
                                          WHEN 'Дефібрилятори' THEN 'defibrillators'
                                          WHEN 'Ларингоскопи' THEN 'laryngoscopes'
                                          WHEN 'Ліжка медичні' THEN 'medical-beds'
                                          WHEN 'Столики медичного призначення' THEN 'medical-tables'
                                          WHEN 'Штативи' THEN 'stands'
                                          WHEN 'Стійки медичні' THEN 'medical-racks'
                                          WHEN 'Шафи медичні' THEN 'medical-cabinets'
                                          WHEN 'Кушетки медичні  та столи масажні' THEN 'couches-massage-tables'
                                          WHEN 'Візки медичні та візки для перевезення хворих' THEN 'medical-carts'
                                          WHEN 'Крісла медичні' THEN 'medical-armchairs'
                                          WHEN 'Тумби медичні' THEN 'medical-nightstands'
                                          WHEN 'Ультразвукова терапія' THEN 'ultrasound-therapy'
                                          WHEN 'Терапія' THEN 'therapy'
                                          WHEN 'Електротерапія' THEN 'electrotherapy'
                                          WHEN 'Опромінювачі фізіотерапевтичні' THEN 'physiotherapy-lamps'
                                          WHEN 'Комбінована терапія' THEN 'combined-therapy'
                                          WHEN 'Лазерна терапія' THEN 'laser-therapy'
                                          WHEN 'Реабілітаційне обладнання' THEN 'rehabilitation-equipment'
          
                                          WHEN 'Магнітотерапія' THEN 'magnetotherapy'
          
                                          WHEN 'Офтальмологічні мікроскопи' THEN 'ophthalmic-microscopes'
                                          WHEN 'Лампи щілинні' THEN 'slit-lamps'
                                          WHEN 'Офтальмоскопи' THEN 'ophthalmoscopes'
                                          WHEN 'Діагностика' THEN 'diagnostics'
          
                                          WHEN 'Набори офтальмологічних окулярних лінз' THEN 'ophthalmic-eyeglass-lens-sets'
                                          WHEN 'Мікроскопи операційні для офтальмології' THEN 'operating-microscopes-for-ophthalmology'
                                          WHEN 'Столи операційні' THEN 'operating-tables'
          
                                          WHEN 'Фетальні монітори та доплери' THEN 'fetal-monitors-dopplers'
                                          WHEN 'Гінекологічні крісла-столи' THEN 'gynecology-chairs'
                                          WHEN 'Інкубатори для новонароджених' THEN 'infant-incubators'
                                          WHEN 'Меблі для неонталогії' THEN 'neonatology-furniture'
                                          WHEN 'Ліжка акушерські' THEN 'obstetric-beds'
                                          WHEN 'Кольпоскопи' THEN 'colposcopes'
                                          WHEN 'Білірубінометри' THEN 'bilirubinometers'
                                          WHEN 'Обладнання для фототерапії' THEN 'phototherapy-equipment'

                                          WHEN 'Кисневі концентратори' THEN 'oxygen-concentrators'
          
                                          WHEN 'Стерилізатори медичні' THEN 'medical-sterilizers'
                                          WHEN 'Сухожарові шафи' THEN 'dry-heat-ovens'
                                          WHEN 'Аквадистилятори' THEN 'water-distillers'
                                          WHEN 'Мийні машини' THEN 'washing-machines'
                                          WHEN 'Жорстка ендоскопія' THEN 'rigid-endoscopy'
                                          WHEN 'Гнучка ендоскопія' THEN 'flexible-endoscopy'
                                          WHEN 'Додаткове обладнання для ендоскопії' THEN 'endoscopy-accessories'
          
                                          WHEN 'Біохімія' THEN 'biochemistry'
                                          WHEN 'Гематологія' THEN 'hematology'
                                          WHEN 'Аналіз електролітів та газів крові' THEN 'blood-gas-electrolyte-analysis'
                                          WHEN 'Імуноферментний Аналіз' THEN 'elisa-analysis'
                                          WHEN 'Росхідні матеріали та допоміжні матеріали для лабораторії' THEN 'lab-consumables'
          
                                          WHEN 'Мiкроскопи' THEN 'microscopes'
                                          WHEN 'Аналізатори сечі' THEN 'urine-analyzers'
          
                                          WHEN 'КТ' THEN 'ct'
                                          WHEN 'МРТ' THEN 'mri'
                                          WHEN 'Рентген апарати стаціонарні та пересувні' THEN 'x-ray-devices'
                                          WHEN 'Ангіографи' THEN 'angiographs'
                                          WHEN 'Флюрографи' THEN 'fluorographs'
                                          WHEN 'Денситометри' THEN 'densitometers'
                                          WHEN 'Мамографи' THEN 'mammographs'
                                          WHEN 'Лазери' THEN 'lasers'
                                          WHEN 'Стоматологічні установки' THEN 'dental-chairs'
                                          WHEN 'Компресори та аспіратори' THEN 'compressors-aspirators'
                                          WHEN 'Стерилізація' THEN 'dental-sterilization'
                                          WHEN 'Візіографи' THEN 'visiographs'
                                          WHEN 'Дентальні рентгени' THEN 'dental-x-rays'
                                          WHEN 'Стоматологічні лазери' THEN 'dental-lasers'
                                          WHEN 'Дерматологія' THEN 'dermatology'
                                          WHEN 'Косметологія' THEN 'cosmetology'
      END
      WHERE path IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE subcategories DROP COLUMN IF EXISTS path;`);
    await queryRunner.query(`ALTER TABLE categories DROP COLUMN IF EXISTS path;`);
  }
}
