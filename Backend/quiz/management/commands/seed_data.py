from django.core.management.base import BaseCommand
from django.db import transaction

from quiz.models import Quiz, Question, Answer


# Each question is: (question text, four options, zero-based index of correct option).
QUIZZES = [
    {
        "title": "Python Fundamentals - Basic",
        "author": "Quiz App",
        "questions": [
            ("Which keyword is used to define a function in Python?", ["func", "def", "function", "define"], 1),
            ("Which symbol starts a single-line comment in Python?", ["//", "/*", "#", "--"], 2),
            ("What is the output of print(2 ** 3)?", ["6", "8", "9", "5"], 1),
            ("Which of these is a valid variable name?", ["2name", "first-name", "first_name", "class"], 2),
            ("What is the type of 3.14?", ["int", "str", "float", "bool"], 2),
            ("Which function displays output in Python?", ["echo()", "console()", "print()", "write()"], 2),
            ("What is the result of 7 // 2?", ["3.5", "4", "3", "2"], 2),
            ("Which value represents Boolean true in Python?", ["true", "TRUE", "True", "1True"], 2),
            ("Which keyword checks a condition?", ["if", "when", "check", "case"], 0),
            ("Which keyword handles the alternative branch of an if statement?", ["elseif", "else", "otherwise", "default"], 1),
            ("What does len('Python') return?", ["5", "6", "7", "None"], 1),
            ("Which function converts the string '12' to an integer?", ["str('12')", "int('12')", "float('12')", "bool('12')"], 1),
            ("Which operator tests equality?", ["=", "==", "!=", ":="], 1),
            ("What is the result of 10 % 3?", ["0", "1", "3", "3.33"], 1),
            ("Which loop is commonly used to iterate over a sequence?", ["repeat", "foreach", "for", "loop"], 2),
            ("What does range(3) produce when iterated?", ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3 only"], 1),
            ("Which keyword immediately exits a loop?", ["stop", "exit", "break", "return"], 2),
            ("Which keyword skips to the next loop iteration?", ["skip", "continue", "pass", "next"], 1),
            ("What is the result of bool(0)?", ["True", "False", "0", "Error"], 1),
            ("Which built-in function reads input from the user?", ["scan()", "read()", "input()", "get()"], 2),
        ],
    },
    {
        "title": "Python Data Structures - Basic",
        "author": "Quiz App",
        "questions": [
            ("Which brackets create a list?", ["()", "{}", "[]", "<>"], 2),
            ("Which collection is immutable?", ["list", "dict", "set", "tuple"], 3),
            ("What is the index of the first item in a Python list?", ["0", "1", "-1", "It has no index"], 0),
            ("What does [10, 20, 30][1] return?", ["10", "20", "30", "1"], 1),
            ("Which list method adds one item to the end?", ["add()", "append()", "insert_end()", "push()"], 1),
            ("Which list method removes and returns the last item by default?", ["delete()", "remove()", "pop()", "discard()"], 2),
            ("What does 'Py' + 'thon' evaluate to?", ["Py thon", "Python", "['Py', 'thon']", "Error"], 1),
            ("What does 'python'[0] return?", ["p", "y", "n", "python"], 0),
            ("Which method converts a string to lowercase?", ["lower()", "downcase()", "tolower()", "casefolding()"], 0),
            ("Which literal creates an empty dictionary?", ["[]", "()", "{}", "set()"], 2),
            ("Which dictionary method returns a value for a key, optionally with a default?", ["find()", "get()", "value()", "fetch_value()"], 1),
            ("What happens when a dictionary key is assigned a new value?", ["A duplicate key is added", "The existing value is replaced", "The dictionary is cleared", "Python raises an error every time"], 1),
            ("Which built-in type stores unique elements?", ["list", "tuple", "set", "str"], 2),
            ("What does len({1, 2, 2, 3}) return?", ["4", "3", "2", "Error"], 1),
            ("Which operator computes the intersection of two sets?", ["|", "&", "^", "-"], 1),
            ("How do you create a tuple containing only the integer 5?", ["(5)", "[5]", "(5,)", "{5:}"], 2),
            ("What does 'a,b,c'.split(',') return?", ["'abc'", "('a', 'b', 'c')", "['a', 'b', 'c']", "{'a', 'b', 'c'}"], 2),
            ("Which expression makes a shallow copy of a list named items?", ["items.copy()", "copy(items, deep=True)", "items.clone()", "items.duplicate()"], 0),
            ("What does sorted([3, 1, 2]) return?", ["[3, 1, 2]", "[1, 2, 3]", "None", "Error"], 1),
            ("Which keyword checks whether a value exists in a collection?", ["has", "contains", "in", "within"], 2),
        ],
    },
    {
        "title": "Python Functions and OOP - Basic",
        "author": "Quiz App",
        "questions": [
            ("What does a function return if it has no return statement?", ["0", "False", "None", "An empty string"], 2),
            ("Which keyword sends a value back from a function?", ["send", "yield_value", "return", "break"], 2),
            ("What is a parameter in a function?", ["A value supplied only after the program ends", "A named input variable in the function definition", "The function's output type", "A Python module"], 1),
            ("What does *args collect in a function definition?", ["Extra positional arguments in a tuple", "Extra keyword arguments in a dictionary", "Only integers", "The function return value"], 0),
            ("What does **kwargs collect in a function definition?", ["Extra positional arguments in a list", "Extra keyword arguments in a dictionary", "Only strings", "All local variables"], 1),
            ("Which keyword creates an anonymous function?", ["lambda", "anon", "func", "yield"], 0),
            ("What is the result of (lambda x: x * 2)(4)?", ["4", "6", "8", "16"], 2),
            ("Which keyword imports a module?", ["include", "using", "import", "require"], 2),
            ("What does 'import math' make available?", ["The math module and its members through math", "Every Python package installed", "Only the print function", "A new class named Math automatically"], 0),
            ("What is a class in object-oriented programming?", ["A blueprint for creating objects", "A loop that repeats code", "A built-in list", "A database connection"], 0),
            ("What is an instance?", ["A syntax error", "An object created from a class", "A Python keyword", "A module alias"], 1),
            ("Which method is commonly used to initialize a new object's attributes?", ["__start__", "__create__", "__init__", "__main__"], 2),
            ("What does self conventionally refer to in an instance method?", ["The current instance", "The parent module", "The class's source file", "The return value"], 0),
            ("Which syntax declares that Dog inherits from Animal?", ["class Dog extends Animal:", "class Dog(Animal):", "class Dog -> Animal:", "inherit Dog from Animal"], 1),
            ("What is the purpose of try/except?", ["Repeat a loop", "Handle exceptions", "Define a class", "Import a module"], 1),
            ("Which block runs when a matching exception is raised in a try block?", ["else only", "except", "finally only", "case"], 1),
            ("Which block is generally used for cleanup whether an exception occurs or not?", ["except", "finally", "elif", "assert"], 1),
            ("What does open('file.txt', 'r') request?", ["Open a file for reading", "Open a file for appending", "Delete the file", "Open a file for binary writing"], 0),
            ("Why is the with statement useful when working with files?", ["It automatically manages closing the file", "It converts the file to JSON", "It prevents all file errors", "It encrypts the file"], 0),
            ("What does if __name__ == '__main__': commonly check?", ["Whether the file is being run as the main program", "Whether Python is installed", "Whether a class has a constructor", "Whether a function returns None"], 0),
        ],
    },
]


class Command(BaseCommand):
    help = "Create 3 beginner Python quizzes with 20 multiple-choice questions each."

    @transaction.atomic
    def handle(self, *args, **options):
        total_questions = 0
        total_answers = 0

        for quiz_data in QUIZZES:
            quiz, _ = Quiz.objects.update_or_create(
                title=quiz_data["title"],
                defaults={"author": quiz_data["author"]},
            )

            # Re-running this command replaces questions only for these three quizzes.
            quiz.questions.all().delete()

            for question_text, options_list, correct_index in quiz_data["questions"]:
                question = Question.objects.create(
                    quiz=quiz,
                    title=question_text,
                )

                for index, option_text in enumerate(options_list):
                    Answer.objects.create(
                        question=question,
                        answer=option_text,
                        is_right=(index == correct_index),
                    )
                    total_answers += 1

                total_questions += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created '{quiz.title}': {len(quiz_data['questions'])} questions"
                )
            )

        self.stdout.write(self.style.SUCCESS(
            f"\nSEED DATA COMPLETED: 3 quizzes, {total_questions} questions, "
            f"{total_answers} answer options."
        ))
