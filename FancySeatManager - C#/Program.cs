/*
miwied - FancySeatManager - october 2022
https://github.com/miwied/FancySeatManager
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FancySeatManager
{
    // stores the group information
    class Group
    {
        public Group(int setGroupSize)
        {
            Size = setGroupSize; // group size
            Id = nextId ++; // autoincrement id
        }
        public int Id { get; set; }
        public static int nextId = 1;
        public int Size { get; set; } 
    }

    // stores the seat information
    class Seat
    {
        public Seat(bool SetUsedFlag)
        {
            IsUsed = SetUsedFlag;
        }
        public bool IsUsed { get; set; } // is the seat used?
        public int UsedByGroup { get; set; } // seat used by group (id)
    }

    // stores the empty-seats-counter with the associated index
    class CounterAndIndex
    {
        public CounterAndIndex(int SetCounter, int SetIndex)
        {
            Counter = SetCounter;
            Index = SetIndex;
        }
        public int Counter { get; set; }  // counter of empty seats
        public int Index { get; set; } // index where the counter starts
    }

    internal class Program
    {
        // method to get numbers from console
        static int GetNrFromConsole()
        {
            int ErgToInt;
            Int32.TryParse(Console.ReadLine(), out ErgToInt);
            return ErgToInt;
        }

        // set how many seats the table has
        static List<Seat> Seats = new List<Seat>(); // seats
        static void SetSeatCount()
        {
            Console.WriteLine("Anzahl Sitzplaetze: ");
            int SeatCount = GetNrFromConsole();
            for (int i = 0; i < SeatCount; i++)
            {
                Seats.Add(new Seat(false));
            }
            PrintCurrentSeatState();
        }

        // print all seats with the current state (empty or occupied)
        static void PrintCurrentSeatState()
        {
            Console.WriteLine("");
            Console.WriteLine("Akutelle Sitzplätze:");
            Console.WriteLine("-------------------------");
            for(int i = 0; i < Seats.Count; i++)
            {
                if(Seats[i].IsUsed)
                {
                    Console.WriteLine($"Sitz {i}: Gruppe {Seats[i].UsedByGroup} sitzt hier");
                }
                else
                {
                    Console.WriteLine($"Sitz {i}: Leer");
                }
            }
            Console.WriteLine("-------------------------");
            Console.WriteLine("");
        }

        // add new group
        static void AddGroup()
        {
            Console.WriteLine("Gruppengroesse: ");
            // create new group with user-inputed size
            if (CheckForSmallestEmptySeatChain(new Group(GetNrFromConsole())))
            {
                Console.Clear();
                Console.WriteLine("Der Gruppe wurde ein Platz gegeben");
            }
            else
            {
                Console.Clear();
                Console.WriteLine("Es ist nicht genug Platz vorhanden");
                Group.nextId = Group.nextId - 1; // dont count the groupID up if group couldnt get a seat
            }
        }

        // remove group
        static void RemoveGroup()
        {
            Console.WriteLine("Welche Gruppen soll entfernt werden?");
            int GroupIndex = GetNrFromConsole();

            // flag all seats as "unused" with the corresponding id
            foreach (Seat seat in Seats)
            {
                if (seat.UsedByGroup == GroupIndex)
                {
                    seat.UsedByGroup = 0;
                    seat.IsUsed = false;
                }
            }
        }

        // search for empty seats and store the counter + index into the counters-list
        static bool CheckForSmallestEmptySeatChain(Group group)
        {
            List<CounterAndIndex> Counters = new List<CounterAndIndex>(); // counters
            int emptySeatChainCounter = 0;
            bool lastSeatState = false; // false = was unused, true = was used

            for(int i = 0; i < Seats.Count; i++)
            {
                // if seat is empty
                if (!Seats[i].IsUsed) 
                {
                    // if last seat was empty too
                    if (!lastSeatState) 
                    {
                        emptySeatChainCounter++; // count
                    }
                    lastSeatState = Seats[i].IsUsed; // update last seat state
                }

                // is used to save the latest counter, if we are reaching a used-seat
                if (Seats[i].IsUsed && !lastSeatState && emptySeatChainCounter != 0)
                {
                    Counters.Add(new CounterAndIndex(emptySeatChainCounter, i - emptySeatChainCounter));

                    lastSeatState = false;
                    emptySeatChainCounter = 0;
                }

                // saves the counter in the last iteration
                if (i == Seats.Count - 1 && !Seats[i].IsUsed)
                {
                    Counters.Add(new CounterAndIndex(emptySeatChainCounter, i - emptySeatChainCounter + 1));
                }

                // merge first and last counter together (so it is a loop, not a string)
                if ((i == Seats.Count - 1) && !Seats[Seats.Count - 1].IsUsed && !Seats[0].IsUsed && (Counters.Count > 1))
                {
                    int firstCounter = 0;
                    int highestIndex = 0;
                    int CounterOfHighestIndex = 0;

                    // get the first and highest index with the associated counters
                    foreach (CounterAndIndex cai in Counters)
                    {
                        if (cai.Index == 0)
                        {
                            firstCounter = cai.Counter;
                        }

                        if (cai.Index > highestIndex)
                        {
                            highestIndex = cai.Index;
                            CounterOfHighestIndex = cai.Counter;
                        }
                    }

                    CounterOfHighestIndex = CounterOfHighestIndex + firstCounter; // adding both counters together

                    // remove last counter
                    if (Counters.Count > 1)
                    {
                        Counters.RemoveAt(Counters.Count - 1);
                    }

                    Counters.Add(new CounterAndIndex(CounterOfHighestIndex, highestIndex)); // add new (merged) counter

                    // remove first counter
                    if (Counters.Count > 1)
                    {
                        Counters.Remove(Counters[0]);
                    }
                }
            }

            // remove (filter) counters that are smaller than the group-size
            for (int i = Counters.Count - 1; i >= 0; i--)
            {
                if (Counters[i].Counter < group.Size)
                {
                    Counters.RemoveAt(i);
                }
            }

            // return if no counter is left over (no seat is avaliable)
            if (Counters.Count == 0)
            {
                return false;
            }

            // from all the counters left, filter the smallest (most efficient) one
            int smallestCounter = int.MaxValue;
            int indexOfSmallestCounter = 0;
            foreach (CounterAndIndex cai in Counters)
            {
                if(cai.Counter < smallestCounter)
                {
                    smallestCounter = cai.Counter;
                    indexOfSmallestCounter = cai.Index;
                }
            }

            // flag the determined seats as "used"
            int iterations = indexOfSmallestCounter + group.Size;
            for (int i = indexOfSmallestCounter; i < iterations; i++)
            {
                // if last seat was reached, take the first again (loop)
                if (i > (Seats.Count - 1))
                {
                    iterations = iterations - i; // subtract already flagged seats
                    i = 0; // reset i
                }
                Seats[i].IsUsed = true; // flag seat
                Seats[i].UsedByGroup = group.Id; // save which group (id) sits here
            }

            return true;
        }

        // commang handling loop
        static void CommandHandling()
        {
            bool stop = false;

            while (!stop)
            {
                Console.WriteLine("Gruppe hinzufuegen <a> oder entfernen <r>?");
                string action = Console.ReadLine();

                switch (action)
                {
                    case "a":
                        AddGroup();
                        break;
                    case "r":
                        RemoveGroup();
                        Console.Clear();
                        break;
                    default:
                        stop = true;
                        break;
                }
                PrintCurrentSeatState();
            }
        }

        // main
        static void Main(string[] args)
        {
            SetSeatCount();
            CommandHandling();
        }
    }
}
