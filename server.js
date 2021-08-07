const { UUIDV1 } = require("sequelize");
const Sequelize = require("sequelize");
const { UUID, UUIDV4, STRING, DATE, INTEGER } = Sequelize.DataTypes;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/accdb"
);

const members = ["moe", "lucy", "larry", "ethyl"];
const facilities = ["tennis", "ping-pong", "raquet-ball", "bowling"]; //didn't originally have these

const Member = db.define("member", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  first_name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Facility = db.define("facility", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  fac_name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Booking = db.define("booking", {
  id: {
    type: INTEGER,
    primaryKey: true,
  },
  startTime: {
    type: DATE,
    allowNull: false,
  },
  endTime: {
    type: DATE,
    allowNull: false,
  },
});

Member.belongsTo(Member, { as: "sponsor" });
Member.hasMany(Member, { as: "sponsored", foreignKey: "sponsorId" });

Booking.belongsTo(Member, { as: "bookedBy" }); //didn't originally have these
Booking.belongsTo(Facility);
Facility.hasMany(Booking);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all([
    //moe and them really are being destructured even though they're in an array
    Member.create({ first_name: "moe" }),
    Member.create({ first_name: "lucy" }),
    Member.create({ first_name: "larry" }),
    Member.create({ first_name: "ethyl" }),
  ]);

  const [tennis, ping_pong, raquet_ball, bowling] = await Promise.all([
    Facility.create({ fac_name: "tennis" }),
    Facility.create({ fac_name: "ping-pong" }),
    Facility.create({ fac_name: "raquet-ball" }),
    Facility.create({ fac_name: "bowling" }),
  ]);
};

syncAndSeed();
